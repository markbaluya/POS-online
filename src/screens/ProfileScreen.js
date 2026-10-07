import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, radius } from '../theme';
import { useCart } from '../store/CartContext';
import { useStore } from '../store/StoreContext';

const ROWS = ['Store settings', 'Staff & roles', 'Payments', 'Help center'];

export default function ProfileScreen() {
  const [view, setView] = useState('main');
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {view !== 'main' && (
        <TouchableOpacity style={styles.back} onPress={() => setView('main')}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
      )}
      {view === 'main' && <Main onGo={setView} />}
      {view === 'Store settings' && <StoreSettings done={() => setView('main')} />}
      {view === 'Staff & roles' && <StaffRoles />}
      {view === 'Payments' && <PaymentSettings />}
      {view === 'Help center' && <HelpCenter />}
    </View>
  );
}

function Main({ onGo }) {
  const { store } = useStore();
  return (
    <ScrollView contentContainerStyle={styles.body}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.head}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>M</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>Mark Kevin</Text>
          <Text style={styles.role}>Cashier • {store.name}</Text>
        </View>
        <TouchableOpacity style={styles.edit} activeOpacity={0.8}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>
      {ROWS.map((r) => (
        <TouchableOpacity
          key={r}
          style={styles.row}
          activeOpacity={0.7}
          onPress={() => onGo(r)}>
          <Text style={styles.rowText}>{r}</Text>
          <Text style={styles.chev}>›</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.logout} activeOpacity={0.8}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
      <Text style={styles.ver}>Zillo POS • v1.0</Text>
    </ScrollView>
  );
}

function StoreSettings({ done }) {
  const { store, update } = useStore();
  const [name, setName] = useState(store.name);
  const [hours, setHours] = useState(store.hours);
  const [footer, setFooter] = useState(store.footer);
  const [currency, setCurrency] = useState(store.currency);
  const [saved, setSaved] = useState(false);

  const save = () => {
    update({
      name: name.trim() || store.name,
      hours: hours.trim() || store.hours,
      footer: footer.trim() || store.footer,
      currency,
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      done();
    }, 900);
  };

  return (
    <ScrollView contentContainerStyle={styles.body}>
      <Text style={styles.title}>Store settings</Text>
      <Field label="Store name">
        <TextInput value={name} onChangeText={setName} style={styles.input} />
      </Field>
      <Field label="Open hours">
        <TextInput value={hours} onChangeText={setHours} style={styles.input} />
      </Field>
      <Field label="Receipt footer">
        <TextInput value={footer} onChangeText={setFooter} style={styles.input} />
      </Field>
      <Text style={styles.fieldLabel}>Currency</Text>
      <View style={styles.symRow}>
        {['$', '₱', '€', '₹'].map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.sym, currency === s && styles.symActive]}
            onPress={() => setCurrency(s)}>
            <Text style={[styles.symText, currency === s && styles.symTextActive]}>
              {s}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.save} onPress={save} activeOpacity={0.85}>
        <Text style={styles.saveText}>{saved ? 'Saved ✓' : 'Save changes'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Field({ label, children }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

const SEED_STAFF = [
  { id: '1', name: 'Mark Kevin', role: 'Admin', on: true },
  { id: '2', name: 'Elina Gilbert', role: 'Cashier', on: true },
  { id: '3', name: 'Jose Rizal', role: 'Cook', on: false },
];

function StaffRoles() {
  const [staff, setStaff] = useState(SEED_STAFF);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Cashier');

  const toggle = (id) =>
    setStaff((s) => s.map((p) => (p.id === id ? { ...p, on: !p.on } : p)));
  const remove = (id) => setStaff((s) => s.filter((p) => p.id !== id));
  const add = () => {
    if (!name.trim()) return;
    setStaff((s) => [
      ...s,
      { id: String(Date.now()), name: name.trim(), role: role.trim() || 'Staff', on: true },
    ]);
    setName('');
  };

  return (
    <ScrollView contentContainerStyle={styles.body}>
      <Text style={styles.title}>Staff & roles</Text>
      <Text style={styles.sub}>
        {staff.filter((p) => p.on).length} active of {staff.length}
      </Text>
      {staff.map((p) => (
        <View key={p.id} style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowText}>{p.name}</Text>
            <Text style={styles.role}>{p.role}</Text>
          </View>
          <TouchableOpacity onPress={() => remove(p.id)} style={{ padding: 6 }}>
            <Text style={styles.del}>✕</Text>
          </TouchableOpacity>
          <Switch
            value={p.on}
            onValueChange={() => toggle(p.id)}
            trackColor={{ true: colors.accent }}
          />
        </View>
      ))}
      <Text style={styles.fieldLabel}>Add staff</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Full name"
        placeholderTextColor={colors.muted}
        style={styles.input}
      />
      <View style={{ height: 8 }} />
      <TextInput
        value={role}
        onChangeText={setRole}
        placeholder="Role (Cashier, Cook…)"
        placeholderTextColor={colors.muted}
        style={styles.input}
      />
      <View style={{ height: 8 }} />
      <TouchableOpacity style={styles.save} onPress={add} activeOpacity={0.85}>
        <Text style={styles.saveText}>Add member</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const ALL_METHODS = ['Cash', 'Card', 'QR'];

function PaymentSettings() {
  const { store, setMethodEnabled } = useStore();
  const { payMethod, setPayMethod } = useCart();
  const enabled = ALL_METHODS.filter((m) => store.methodsEnabled[m]);

  const toggle = (m) => {
    const on = !store.methodsEnabled[m];
    if (!on && enabled.length === 1) return; // keep at least one
    setMethodEnabled(m, on);
    if (!on && payMethod === m) {
      const rest = ALL_METHODS.filter((x) => (x === m ? false : store.methodsEnabled[x]));
      if (rest.length) setPayMethod(rest[0]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.body}>
      <Text style={styles.title}>Payments</Text>
      <Text style={styles.sub}>Checkout methods • default: {payMethod}</Text>
      {ALL_METHODS.map((m) => (
        <View key={m} style={styles.row}>
          <Text style={styles.rowText}>{m}</Text>
          <Switch
            value={!!store.methodsEnabled[m]}
            onValueChange={() => toggle(m)}
            trackColor={{ true: colors.accent }}
          />
        </View>
      ))}
      <Text style={styles.fieldLabel}>Default method</Text>
      <View style={styles.symRow}>
        {enabled.map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.sym, payMethod === m && styles.symActive, styles.symWide]}
            onPress={() => setPayMethod(m)}>
            <Text style={[styles.symText, payMethod === m && styles.symTextActive]}>
              {m}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

function HelpCenter() {
  return (
    <ScrollView contentContainerStyle={styles.body}>
      <Text style={styles.title}>Help center</Text>
      {[
        ['How do I void an order?', 'Open Orders, tap the order, choose Void with a manager PIN.'],
        ['How do refunds work?', 'Refunds return to the original payment method within 3–5 days.'],
        ['Printer not working?', 'Check Bluetooth in Store settings → Devices, then re-pair the printer.'],
      ].map(([q, a]) => (
        <View key={q} style={styles.help}>
          <Text style={styles.rowText}>{q}</Text>
          <Text style={styles.role}>{a}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: { padding: 16, gap: 10 },
  back: { paddingHorizontal: 16, paddingTop: 12 },
  backText: { color: colors.accent, fontSize: 15, fontWeight: '800' },
  title: { fontSize: 22, fontWeight: '800', color: colors.ink },
  sub: { fontSize: 12, color: colors.muted },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 4 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 26, fontWeight: '800' },
  name: { fontSize: 18, fontWeight: '800', color: colors.ink },
  role: { fontSize: 12, color: colors.muted, marginTop: 2 },
  edit: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    paddingHorizontal: 18,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editText: { fontSize: 12, fontWeight: '700', color: colors.ink },
  row: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    minHeight: 54,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  rowText: { fontSize: 13, fontWeight: '700', color: colors.ink },
  chev: { fontSize: 18, color: colors.muted, fontWeight: '700' },
  del: { fontSize: 14, color: colors.red, fontWeight: '700' },
  logout: {
    backgroundColor: '#FBE7E3',
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  logoutText: { color: colors.red, fontSize: 14, fontWeight: '800' },
  ver: { fontSize: 11, color: colors.muted },
  fieldLabel: { fontSize: 12, fontWeight: '700', color: colors.muted, marginTop: 4 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    height: 46,
    paddingHorizontal: 12,
    fontSize: 14,
    color: colors.ink,
  },
  symRow: { flexDirection: 'row', gap: 8 },
  sym: {
    width: 52,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  symWide: { width: 90 },
  symActive: { backgroundColor: colors.chip, borderColor: colors.accent },
  symText: { fontSize: 16, fontWeight: '700', color: colors.muted },
  symTextActive: { color: colors.accent },
  save: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  saveText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  help: { backgroundColor: '#fff', borderRadius: 14, padding: 14, gap: 4 },
});
