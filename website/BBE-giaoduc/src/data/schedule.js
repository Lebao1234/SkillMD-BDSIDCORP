/* Lịch khai giảng (dữ liệu mẫu). cat khớp với "key" trong courses.js. branchKey: cg | hbt | online */
const B = { cg: "Cơ sở Cầu Giấy", hbt: "Cơ sở Hai Bà Trưng", online: "Học online qua Zoom" };
const row = (code, cat, name, start, time, branchKey, seats, label) => ({ code, cat, name, start, time, branchKey, branch: B[branchKey], seats, label });

module.exports = [
  row("MOV-0510", "kids", "Cambridge Movers", "05/10/2026", "Thứ 3, Thứ 5 · 17:45-19:15", "cg", 4, "Thiếu nhi - Cambridge Movers (MOV-0510)"),
  row("IEL55-0710", "ielts", "IELTS 5.5+", "07/10/2026", "Thứ 2, 4, 6 · 19:00-21:00", "hbt", 3, "IELTS 5.5+ (IEL55-0710)"),
  row("BIZ-0810", "work", "Giao tiếp trung cấp", "08/10/2026", "Thứ 3, Thứ 5 · 19:15-20:45", "cg", 5, "Giao tiếp trung cấp (BIZ-0810)"),
  row("PET-1010", "teens", "Thiếu niên PET (B1)", "10/10/2026", "Thứ 7, Chủ nhật · 9:00-10:30", "hbt", 6, "Thiếu niên - PET B1 (PET-1010)"),
  row("FLY-1210", "kids", "Cambridge Flyers", "12/10/2026", "Thứ 7, Chủ nhật · 8:00-9:30", "cg", 7, "Thiếu nhi - Cambridge Flyers (FLY-1210)"),
  row("STA-1310", "kids", "Cambridge Starters", "13/10/2026", "Thứ 2, Thứ 4 · 17:45-19:15", "hbt", 0, "Thiếu nhi - Cambridge Starters (STA-1310)"),
  row("KET-1410", "teens", "Thiếu niên KET (A2)", "14/10/2026", "Thứ 3, Thứ 5 · 17:45-19:15", "cg", 8, "Thiếu niên - KET A2 (KET-1410)"),
  row("BIZ-ON-1510", "work", "Giao tiếp cơ bản online", "15/10/2026", "Thứ 2, Thứ 4 · 20:00-21:30", "online", 6, "Giao tiếp cơ bản online (BIZ-ON-1510)"),
  row("IELFD-1910", "ielts", "IELTS Foundation", "19/10/2026", "Thứ 7, Chủ nhật · 14:00-16:00", "cg", 8, "IELTS Foundation (IELFD-1910)"),
  row("IEL65-2110", "ielts", "IELTS 6.5+", "21/10/2026", "Thứ 3, 5, 7 · 19:00-21:00", "cg", 2, "IELTS 6.5+ (IEL65-2110)"),
  row("V10-2610", "teens", "Ôn thi vào 10", "26/10/2026", "Thứ 2, Thứ 6 · 18:00-19:30", "hbt", 9, "Thiếu niên - Ôn thi vào 10 (V10-2610)"),
  row("BIZ-2810", "work", "Giao tiếp nâng cao", "28/10/2026", "Thứ 7 · 9:00-12:00", "hbt", 5, "Giao tiếp nâng cao (BIZ-2810)"),
];
