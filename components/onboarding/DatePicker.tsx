import { useDSTheme } from "@/design-system";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

// 13 years ago — minimum sensible age for a fitness app
const MAX_DATE = new Date(new Date().setFullYear(new Date().getFullYear() - 13));
const MIN_DATE = new Date(new Date().setFullYear(new Date().getFullYear() - 100));

const formatDisplay = (iso: string) => {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const toISO = (date: Date) => date.toISOString().split("T")[0];

interface Props {
  value: string;          // ISO: YYYY-MM-DD or ""
  onChange: (iso: string) => void;
  placeholder?: string;
  hasError?: boolean;
}

export default function DatePicker({ value, onChange, placeholder = "Select date", hasError = false }: Props) {
  const { colors } = useDSTheme();
  const [show, setShow] = useState(false);

  // internal date used while spinning — defaults to 25 years ago if empty
  const defaultDate = new Date(new Date().setFullYear(new Date().getFullYear() - 25));
  const [tempDate, setTempDate] = useState<Date>(value ? new Date(value) : defaultDate);

  const handleAndroidChange = (event: DateTimePickerEvent, selected?: Date) => {
    setShow(false);
    if (event.type === "set" && selected) {
      setTempDate(selected);
      onChange(toISO(selected));
    }
  };

  const handleIOSChange = (_: DateTimePickerEvent, selected?: Date) => {
    if (selected) setTempDate(selected);
  };

  const handleIOSDone = () => {
    setShow(false);
    onChange(toISO(tempDate));
  };

  const handleIOSCancel = () => {
    setShow(false);
    // reset temp back to committed value
    setTempDate(value ? new Date(value) : defaultDate);
  };

  const borderColor = hasError ? colors.error : show ? colors.primary : colors.outlineVariant;
  const displayText = formatDisplay(value);

  return (
    <>
      {/* Trigger field */}
      <Pressable
        onPress={() => setShow(true)}
        style={[
          styles.field,
          { backgroundColor: colors.surfaceContainer, borderColor },
        ]}
      >
        <Text
          style={[
            styles.fieldText,
            {
              color: displayText ? colors.onBackground : colors.outlineVariant,
              fontFamily: "WorkSans_400Regular",
            },
          ]}
        >
          {displayText ?? placeholder}
        </Text>
      </Pressable>

      {/* Android — renders the native dialog directly */}
      {Platform.OS === "android" && show && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="default"
          onChange={handleAndroidChange}
          maximumDate={MAX_DATE}
          minimumDate={MIN_DATE}
        />
      )}

      {/* iOS — modal with spinner wheel + Cancel / Done */}
      {Platform.OS === "ios" && (
        <Modal visible={show} transparent animationType="slide">
          <Pressable style={styles.overlay} onPress={handleIOSCancel} />
          <View style={[styles.sheet, { backgroundColor: colors.surfaceContainer }]}>
            {/* Toolbar */}
            <View style={[styles.toolbar, { borderBottomColor: colors.outlineVariant }]}>
              <Pressable onPress={handleIOSCancel} hitSlop={12}>
                <Text style={[styles.toolbarBtn, { color: colors.onSurfaceVariant, fontFamily: "WorkSans_400Regular" }]}>
                  Cancel
                </Text>
              </Pressable>
              <Text style={[styles.toolbarTitle, { color: colors.onBackground, fontFamily: "WorkSans_700Bold" }]}>
                Date of Birth
              </Text>
              <Pressable onPress={handleIOSDone} hitSlop={12}>
                <Text style={[styles.toolbarBtn, { color: colors.primary, fontFamily: "WorkSans_700Bold" }]}>
                  Done
                </Text>
              </Pressable>
            </View>

            <DateTimePicker
              value={tempDate}
              mode="date"
              display="spinner"
              onChange={handleIOSChange}
              maximumDate={MAX_DATE}
              minimumDate={MIN_DATE}
              style={styles.picker}
              textColor={colors.onBackground}
            />
          </View>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  field:     { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14 },
  fieldText: { fontSize: 15 },

  overlay:      { flex: 1 },
  sheet:        { borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: "hidden" },
  toolbar:      { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  toolbarTitle: { fontSize: 15 },
  toolbarBtn:   { fontSize: 15 },
  picker:       { width: "100%" },
});
