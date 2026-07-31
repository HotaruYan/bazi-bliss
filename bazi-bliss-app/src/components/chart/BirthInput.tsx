import { useState, useMemo } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from "react-native";
import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Colors, FontSize, Radius, Shadow } from "../../constants/theme";
import { useChartStore } from "../../store/useChartStore";

function parseDate(dateStr: string, timeStr: string): Date {
  const d = dateStr ? new Date(dateStr + "T" + (timeStr || "12:00") + ":00") : new Date();
  return isNaN(d.getTime()) ? new Date() : d;
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatTime(d: Date): string {
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${min}`;
}

export function BirthInput() {
  const { name, birthDate, birthTime, birthCity, gender, setBirthInfo, calculate } = useChartStore();
  const [editing, setEditing] = useState(!birthDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const dateValue = useMemo(() => parseDate(birthDate, birthTime), [birthDate, birthTime]);

  const displayMode = Platform.OS === "ios" ? "spinner" : "default";

  const handleDateChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (selected) {
      setBirthInfo({ birthDate: formatDate(selected) });
    }
  };

  const handleTimeChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (selected) {
      setBirthInfo({ birthTime: formatTime(selected) });
    }
  };

  if (!editing) {
    return (
      <View style={styles.card}>
        <View style={styles.summary}>
          <View style={styles.summaryLeft}>
            <Text style={styles.summaryDate}>{name || "Your Name"}</Text>
            <Text style={styles.summaryDetail}>
              {birthDate || "Select Date"} · {birthTime || "12:00"} · {birthCity || "Beijing"} · {gender === "male" ? "Male" : "Female"}
            </Text>
          </View>
          <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(true)}>
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Birth Information</Text>

      {/* 姓名 */}
      <View style={styles.field}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={(v) => setBirthInfo({ name: v })}
          placeholder="Your name"
          placeholderTextColor={Colors.textSecondary}
        />
      </View>

      {/* 日期 — 滚轮 */}
      <View style={styles.field}>
        <Text style={styles.label}>Date</Text>
        <TouchableOpacity
          style={styles.pickerTrigger}
          onPress={() => {
            setShowDatePicker(!showDatePicker);
            setShowTimePicker(false);
          }}
        >
          <Text style={styles.pickerValue}>{birthDate || "Select Date"}</Text>
          <Text style={styles.pickerArrow}>▼</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <View style={styles.pickerContainer}>
            <DateTimePicker
              value={dateValue}
              mode="date"
              display={displayMode}
              onChange={handleDateChange}
              maximumDate={new Date()}
              themeVariant="light"
            />
          </View>
        )}
      </View>

      {/* 时间 — 滚轮 */}
      <View style={styles.field}>
        <Text style={styles.label}>Time (24h)</Text>
        <TouchableOpacity
          style={styles.pickerTrigger}
          onPress={() => {
            setShowTimePicker(!showTimePicker);
            setShowDatePicker(false);
          }}
        >
          <Text style={styles.pickerValue}>{birthTime || "12:00"}</Text>
          <Text style={styles.pickerArrow}>▼</Text>
        </TouchableOpacity>
        {showTimePicker && (
          <View style={styles.pickerContainer}>
            <DateTimePicker
              value={dateValue}
              mode="time"
              display={displayMode}
              onChange={handleTimeChange}
              minuteInterval={1}
              themeVariant="light"
            />
          </View>
        )}
      </View>

      {/* 城市 */}
      <View style={styles.field}>
        <Text style={styles.label}>City</Text>
        <TextInput
          style={styles.input}
          value={birthCity}
          onChangeText={(v) => setBirthInfo({ birthCity: v })}
          placeholder="Beijing"
          placeholderTextColor={Colors.textSecondary}
        />
      </View>

      {/* 性别 */}
      <View style={styles.field}>
        <Text style={styles.label}>Gender</Text>
        <View style={styles.genderRow}>
          <TouchableOpacity
            style={[styles.genderBtn, gender === "male" && styles.genderActive]}
            onPress={() => setBirthInfo({ gender: "male" })}
          >
            <Text style={[styles.genderText, gender === "male" && styles.genderTextActive]}>
              Male
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.genderBtn, gender === "female" && styles.genderActive]}
            onPress={() => setBirthInfo({ gender: "female" })}
          >
            <Text style={[styles.genderText, gender === "female" && styles.genderTextActive]}>
              Female
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 真太阳时提示 */}
      <Text style={styles.disclaimer}>
        Accurate birth time and location are used to calculate True Solar Time. If your birth time is uncertain, leave it at 12:00 (noon) — but note this may affect reading precision.
      </Text>

      {/* CTA */}
      <TouchableOpacity
        style={styles.calculateBtn}
        onPress={() => {
          calculate();
          setEditing(false);
        }}
      >
        <Text style={styles.calculateBtnText}>Calculate Chart</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditing(false)}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    ...Shadow.card,
    padding: 16,
  },
  // 折叠态
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLeft: {
    gap: 2,
  },
  summaryDate: {
    fontSize: FontSize.bodyLarge,
    fontWeight: "700",
    color: Colors.text,
  },
  summaryDetail: {
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
  },
  editBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.bg,
  },
  editBtnText: {
    fontSize: FontSize.body,
    fontWeight: "600",
    color: Colors.accent,
  },
  // 编辑态
  sectionTitle: {
    fontSize: FontSize.h3,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 16,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    fontSize: FontSize.caption,
    fontWeight: "600",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.bg,
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    fontSize: FontSize.body,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pickerTrigger: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.bg,
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pickerValue: {
    fontSize: FontSize.body,
    color: Colors.text,
  },
  pickerArrow: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  pickerContainer: {
    marginTop: 4,
    backgroundColor: Colors.bg,
    borderRadius: Radius.md,
    overflow: "hidden",
    alignItems: "center",
  },
  genderRow: {
    flexDirection: "row",
    gap: 10,
  },
  genderBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    backgroundColor: Colors.bg,
  },
  genderActive: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accent + "18",
  },
  genderText: {
    fontSize: FontSize.body,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  genderTextActive: {
    color: Colors.accent,
    fontWeight: "700",
  },
  disclaimer: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginTop: 4,
    marginBottom: 4,
  },
  calculateBtn: {
    backgroundColor: Colors.deep,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 6,
  },
  calculateBtnText: {
    fontSize: FontSize.body,
    fontWeight: "700",
    color: Colors.textOnDark,
  },
  cancelBtn: {
    marginTop: 10,
    alignItems: "center",
  },
  cancelText: {
    fontSize: FontSize.body,
    color: Colors.textSecondary,
  },
});
