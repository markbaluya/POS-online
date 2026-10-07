import React, { useState } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { colors, radius } from '../theme';
import { fmt, useCart } from '../store/CartContext';
import { useStore } from '../store/StoreContext';

const METHODS = ['Cash', 'Card', 'QR'];

export function QtyStepper({ id, qty, small }) {
  const { inc, dec } = useCart();
  const s = small ? 22 : 26;
  return (
    <View style={styles.stepper}>
      <TouchableOpacity
        style={[styles.stepBtn, styles.minus, { width: s, height: s, borderRadius: s / 2 }]}
        onPress={() => dec(id)}>
        <Text style={styles.minusText}>−</Text>
      </TouchableOpacity>
      <Text style={styles.qty}>{qty}</Text>
      <TouchableOpacity
        style={[styles.stepBtn, styles.plus, { width: s, height: s, borderRadius: s / 2 }]}
        onPress={() => inc(id)}>
        <Text style={styles.plusText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

export function CartLines({ compact }) {
  const { entries } = useCart();
  const { money } = useStore();
  if (!entries.length)
    return <Text style={styles.empty}>Cart is empty — tap + to add items.</Text>;
  return (
    <View style={{ gap: compact ? 8 : 10 }}>
      {entries.map(({ item, qty }) => (
        <View key={item.id} style={styles.row}>
          <Image source={item.image} style={styles.rowThumb} />
          <View style={{ flex: 1 }}>
            <Text style={styles.rowName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.rowPrice}>{money(item.price)}</Text>
          </View>
          <QtyStepper id={item.id} qty={qty} small={compact} />
        </View>
      ))}
    </View>
  );
}

export function CartTotals() {
  const { count, subtotal, discount, tax, total } = useCart();
  const { money } = useStore();
  return (
    <View style={{ gap: 4, marginTop: 12 }}>
      <TotalRow label={`Items  ${count}`} value={money(subtotal)} />
      <TotalRow label="Discount" value={`-${money(discount)}`} muted />
      <TotalRow label="Tax (10%)" value={money(tax)} muted />
      <View style={styles.grandRow}>
        <Text style={styles.grandLabel}>Total</Text>
        <Text style={styles.grandValue}>{money(total)}</Text>
      </View>
    </View>
  );
}

function TotalRow({ label, value, muted }) {
  return (
    <View style={styles.totalRow}>
      <Text style={[styles.totalLabel, muted && { color: colors.muted }]}>{label}</Text>
      <Text style={styles.totalValue}>{value}</Text>
    </View>
  );
}

export function PayMethods() {
  const { payMethod, setPayMethod } = useCart();
  const { store } = useStore();
  const methods = METHODS.filter((m) => store.methodsEnabled[m]);
  return (
    <View>
      <Text style={styles.sectionTitle}>Payment Method</Text>
      <View style={styles.methods}>
        {methods.map((m) => {
          const sel = m === payMethod;
          return (
            <TouchableOpacity
              key={m}
              style={[styles.method, sel && styles.methodActive]}
              onPress={() => setPayMethod(m)}>
              <Text style={[styles.methodText, sel && styles.methodTextActive]}>{m}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function luhnOk(num) {
  const d = num.replace(/\D/g, '');
  if (d.length < 13 || d.length > 19) return false;
  let sum = 0;
  let dbl = false;
  for (let i = d.length - 1; i >= 0; i--) {
    let n = parseInt(d[i], 10);
    if (dbl) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    dbl = !dbl;
  }
  return sum % 10 === 0;
}

const fmtCard = (v) =>
  v
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim();

const fmtExpiry = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 4);
  if (d.length <= 2) return d;
  return d.slice(0, 2) + '/' + d.slice(2);
};

function expiryOk(v) {
  const m = v.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
  if (!m) return false;
  const exp = new Date(2000 + parseInt(m[2], 10), parseInt(m[1], 10));
  return exp > new Date();
}

export function CheckoutButton() {
  const { entries, count, subtotal, discount, tax, total, payMethod, clear } =
    useCart();
  const { money, store } = useStore();
  const [sheet, setSheet] = useState(false); // payment sheet
  const [done, setDone] = useState(false); // receipt
  const [busy, setBusy] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [card, setCard] = useState({ num: '', exp: '', cvv: '', name: '' });
  const [cardErr, setCardErr] = useState('');

  const open = () => {
    if (!count || busy) return;
    setCardErr('');
    setOrderId(`ORD-${String(Date.now()).slice(-6)}`);
    setSheet(true);
  };

  const finish = () => {
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setSheet(false);
      setDone(true);
    }, 900);
  };

  const payCash = () => finish();

  const payCard = () => {
    if (!luhnOk(card.num)) return setCardErr('Card number is invalid.');
    if (!expiryOk(card.exp)) return setCardErr('Expiry must be MM/YY in the future.');
    if (!/^\d{3,4}$/.test(card.cvv.replace(/\D/g, ''))) {
      return setCardErr('CVV must be 3-4 digits.');
    }
    if (!card.name.trim()) return setCardErr('Enter the name on card.');
    setCardErr('');
    finish();
  };

  const qrPayload = JSON.stringify({
    store: store.name,
    order: orderId,
    amount: Number(total.toFixed(2)),
    currency: store.currency,
    method: 'QR',
  });

  const last4 = card.num.replace(/\D/g, '').slice(-4);

  return (
    <>
      <TouchableOpacity
        style={[styles.cta, !count && { opacity: 0.5 }]}
        onPress={open}
        activeOpacity={0.85}>
        <Text style={styles.ctaText}>
          Process Transaction • {money(total)}
        </Text>
      </TouchableOpacity>

      {/* payment sheet */}
      <Modal visible={sheet} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={[styles.modalCard, styles.sheetCard]}>
            <ScrollView
              contentContainerStyle={{ gap: 10 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
            <Text style={styles.modalTitle}>
              Pay {money(total)} via {payMethod}
            </Text>
            <Text style={styles.modalSub}>
              {orderId} • {count} items
            </Text>

            {payMethod === 'Cash' && (
              <>
                <Text style={styles.sheetHint}>
                  Collect {money(total)} in cash, then confirm below.
                </Text>
                <TouchableOpacity
                  style={styles.cta}
                  onPress={payCash}
                  disabled={busy}
                  activeOpacity={0.85}>
                  <Text style={styles.ctaText}>
                    {busy ? 'Confirming…' : `Confirm cash payment`}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {payMethod === 'Card' && (
              <View style={{ gap: 8 }}>
                <TextInput
                  value={card.name}
                  onChangeText={(v) => setCard({ ...card, name: v })}
                  placeholder="Name on card"
                  placeholderTextColor={colors.muted}
                  style={styles.input}
                />
                <TextInput
                  value={card.num}
                  onChangeText={(v) => setCard({ ...card, num: fmtCard(v) })}
                  placeholder="4242 4242 4242 4242"
                  placeholderTextColor={colors.muted}
                  keyboardType="number-pad"
                  style={styles.input}
                />
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TextInput
                    value={card.exp}
                    onChangeText={(v) => setCard({ ...card, exp: fmtExpiry(v) })}
                    placeholder="MM/YY"
                    placeholderTextColor={colors.muted}
                    keyboardType="number-pad"
                    style={[styles.input, { flex: 1 }]}
                  />
                  <TextInput
                    value={card.cvv}
                    onChangeText={(v) =>
                      setCard({ ...card, cvv: v.replace(/\D/g, '').slice(0, 4) })
                    }
                    placeholder="CVV"
                    placeholderTextColor={colors.muted}
                    keyboardType="number-pad"
                    secureTextEntry
                    style={[styles.input, { flex: 1 }]}
                  />
                </View>
                {!!cardErr && <Text style={styles.err}>{cardErr}</Text>}
                <TouchableOpacity
                  style={styles.cta}
                  onPress={payCard}
                  disabled={busy}
                  activeOpacity={0.85}>
                  <Text style={styles.ctaText}>
                    {busy ? 'Charging…' : `Pay ${money(total)}`}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {payMethod === 'QR' && (
              <View style={{ alignItems: 'center', gap: 10 }}>
                <View style={styles.qrBox}>
                  <QRCode value={qrPayload} size={190} />
                </View>
                <Text style={styles.sheetHint}>
                  Scan with any wallet to pay {money(total)}
                </Text>
                <TouchableOpacity
                  style={[styles.cta, { alignSelf: 'stretch' }]}
                  onPress={finish}
                  disabled={busy}
                  activeOpacity={0.85}>
                  <Text style={styles.ctaText}>
                    {busy ? 'Verifying…' : "I've completed payment"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              onPress={() => !busy && setSheet(false)}
              style={{ alignSelf: 'center' }}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* receipt */}
      <Modal visible={done} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Payment successful ✓</Text>
            <Text style={styles.modalSub}>
              {orderId} • {money(total)} via {payMethod}
              {payMethod === 'Card' && last4 ? ` •• ${last4}` : ''}
            </Text>
            <View style={styles.receipt}>
              {entries.map(({ item, qty }) => (
                <View key={item.id} style={styles.rRow}>
                  <Text style={styles.rText}>
                    {qty}× {item.name}
                  </Text>
                  <Text style={styles.rText}>{money(item.price * qty)}</Text>
                </View>
              ))}
              <View style={styles.rRow}>
                <Text style={styles.rMuted}>Discount</Text>
                <Text style={styles.rMuted}>-{money(discount)}</Text>
              </View>
              <View style={styles.rRow}>
                <Text style={styles.rMuted}>Tax</Text>
                <Text style={styles.rMuted}>{money(tax)}</Text>
              </View>
              <View style={styles.rRow}>
                <Text style={styles.rTotal}>Total</Text>
                <Text style={styles.rTotal}>{money(total)}</Text>
              </View>
            </View>
            <Text style={styles.footer}>{store.footer}</Text>
            <TouchableOpacity
              style={styles.cta}
              onPress={() => {
                setDone(false);
                clear();
              }}>
              <Text style={styles.ctaText}>New order</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

export function CartPanel() {
  return (
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>Detail Items</Text>
      <CartLines compact />
      <CartTotals />
      <View style={{ height: 12 }} />
      <PayMethods />
      <View style={{ height: 12 }} />
      <CheckoutButton />
    </View>
  );
}

const styles = StyleSheet.create({
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepBtn: { alignItems: 'center', justifyContent: 'center' },
  minus: { backgroundColor: '#F0F0F5' },
  minusText: { fontSize: 14, fontWeight: '700', color: colors.ink },
  plus: { backgroundColor: colors.accent },
  plusText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  qty: { fontSize: 13, fontWeight: '700', color: colors.ink, minWidth: 18, textAlign: 'center' },
  empty: { color: colors.muted, fontSize: 13, paddingVertical: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: radius.md,
    padding: 8,
    shadowColor: '#260F06',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  rowThumb: { width: 46, height: 46, borderRadius: 8, backgroundColor: '#EDEDEF' },
  rowName: { fontSize: 12, fontWeight: '700', color: colors.ink },
  rowPrice: { fontSize: 11, color: colors.muted, marginTop: 2 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between' },
  totalLabel: { fontSize: 12, color: colors.ink },
  totalValue: { fontSize: 12, fontWeight: '600', color: colors.ink },
  grandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  grandLabel: { fontSize: 15, fontWeight: '800', color: colors.ink },
  grandValue: { fontSize: 15, fontWeight: '800', color: colors.ink },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: colors.ink, marginBottom: 8 },
  methods: { flexDirection: 'row', gap: 8 },
  method: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodActive: { backgroundColor: colors.chip, borderColor: colors.accent },
  methodText: { fontSize: 12, fontWeight: '700', color: colors.muted },
  methodTextActive: { color: colors.accent },
  cta: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    shadowColor: colors.accent,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  ctaText: { color: '#fff', fontSize: 14, fontWeight: '800', textAlign: 'center' },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 380,
    gap: 10,
  },
  sheetCard: { padding: 16, maxHeight: '88%' },
  modalTitle: { fontSize: 18, fontWeight: '800', color: colors.ink, textAlign: 'center' },
  modalSub: { fontSize: 13, color: colors.muted, textAlign: 'center', marginBottom: 8 },
  input: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    height: 44,
    paddingHorizontal: 12,
    fontSize: 14,
    color: colors.ink,
  },
  err: { color: colors.red, fontSize: 12, fontWeight: '700' },
  sheetHint: { fontSize: 13, color: colors.muted, textAlign: 'center', marginBottom: 4 },
  cancel: { color: colors.muted, fontSize: 14, fontWeight: '700' },
  qrBox: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
  },
  receipt: {
    backgroundColor: colors.bg,
    borderRadius: 12,
    padding: 12,
    gap: 6,
    marginBottom: 4,
  },
  rRow: { flexDirection: 'row', justifyContent: 'space-between' },
  rText: { fontSize: 12, color: colors.ink, fontWeight: '600' },
  rMuted: { fontSize: 12, color: colors.muted },
  rTotal: { fontSize: 14, fontWeight: '800', color: colors.ink },
  footer: {
    fontSize: 12,
    color: colors.muted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 8,
  },
  panel: {
    backgroundColor: colors.panel,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.line,
  },
  panelTitle: { fontSize: 16, fontWeight: '800', color: colors.ink, marginBottom: 10 },
});
