import React, { useEffect, useState, useMemo } from "react";
import Swal from "sweetalert2";
import { apiService } from "../../../services/apiService";
import {
  Search,
  Bell,
  User,
  Users,
  UserCog,
  FileText,
  Trash2,
  TrendingUp,
  MapPin,
  Truck,
  Package,
  ChevronRight,
} from "lucide-react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  ArcElement,
  Legend,
} from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

import AdminSidebar from "./AdminSidebar";

const AdminDashboard = () => {
  const [totalWarga, setTotalWarga] = useState(0);
  const [totalPetugas, setTotalPetugas] = useState(0);
  const [totalTransaksi, setTotalTransaksi] = useState(0);
  const [totalSampah, setTotalSampah] = useState(0);
  const [pickupData, setPickupData] = useState([]);
  const [loading, setLoading] = useState(true);
  const now = new Date();
  const userName = localStorage.getItem("nama") || "Admin";
  const [allWaste, setAllWaste] = useState([]);
  const [filteredWaste, setFilteredWaste] = useState([]);

  useEffect(() => {
    console.log("=== ADMIN DASHBOARD ALERT ===");
    console.log("userName:", userName);

    sessionStorage.removeItem("admin-dashboard-toast");

    const alreadyShown = sessionStorage.getItem("admin-dashboard-toast");
    console.log("alreadyShown after clear:", alreadyShown);

    if (!alreadyShown) {
      console.log("Showing welcome alert!");

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });

      Toast.fire({
        icon: "success",
        title: `Selamat datang, ${userName}!`,
        text: "Anda berhasil login.",
      });

      sessionStorage.setItem("admin-dashboard-toast", "true");
    }
  }, [userName]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, transaksiRes, sampahRes] = await Promise.all([
          apiService.getUsers(),
          apiService.getTransaksi(),
          apiService.getSampah(),
        ]);

        const allUsers = usersRes.data;
        const allTransaksi = transaksiRes.data;
        const allWasteData = sampahRes.data;

        const wasteSelesai = allWasteData.filter(
          (item) => item.status === "SELESAI",
        );

        const totalBerat = wasteSelesai.reduce((total, item) => {
          const ignoreFields = [
            "wasteId",
            "userId",
            "status",
            "tanggalInput",
            "deskripsi",
            "namaSampah",
            "waste_id",
            "user_id",
            "tanggal_input",
            "idKategori",
          ];

          let beratPerBaris = 0;

          Object.keys(item).forEach((key) => {
            if (!ignoreFields.includes(key) && item[key] !== null) {
              const nilai = parseFloat(item[key]);
              if (!isNaN(nilai)) {
                beratPerBaris += nilai;
              }
            }
          });

          return total + beratPerBaris;
        }, 0);

        const warga = allUsers.filter((user) => user.role === "WARGA");
        const petugas = allUsers.filter((user) => user.role === "PETUGAS");

        setTotalWarga(warga.length);
        setTotalPetugas(petugas.length);
        setTotalTransaksi(allTransaksi.length);
        setTotalSampah(totalBerat);
      } catch (error) {
        console.error("Gagal ambil data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchJadwal = async () => {
      try {
        const response = await apiService.getJadwal();

        const today = new Date().toLocaleDateString("en-CA");

        const filtered = response.data.filter((item) => {
          const tglItem = Array.isArray(item.tanggalTugas)
            ? `${item.tanggalTugas[0]}-${String(item.tanggalTugas[1]).padStart(2, "0")}-${String(item.tanggalTugas[2]).padStart(2, "0")}`
            : item.tanggalTugas;

          return tglItem === today;
        });

        setPickupData(filtered);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJadwal();
  }, []);

  const filteredData = useMemo(() => {
    const today = new Date().toLocaleDateString("en-CA");

    return pickupData.filter((item) => {
      let tglItem = item.tanggalTugas;

      if (Array.isArray(tglItem)) {
        const year = tglItem[0];
        const month = String(tglItem[1]).padStart(2, "0");
        const day = String(tglItem[2]).padStart(2, "0");
        tglItem = `${year}-${month}-${day}`;
      }

      return tglItem === today;
    });
  }, [pickupData]);

  const todayDisplay = now.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const statsData = [
    {
      title: "Total Warga",
      value: String(totalWarga ?? 0),
      unit: "orang",
      icon: <Users size={26} />,
      iconBg: "#38B46A",
      valueColor: "#38B46A",
    },
    {
      title: "Total Petugas",
      value: String(totalPetugas ?? 0),
      unit: "orang",
      icon: <UserCog size={26} />,
      iconBg: "#5B9CF6",
      valueColor: "#5B9CF6",
    },
    {
      title: "Total Transaksi",
      value: String(totalTransaksi ?? 0),
      unit: "transaksi",
      icon: <FileText size={26} />,
      iconBg: "#FF9F43",
      valueColor: "#FF9F43",
    },
    {
      title: "Total Sampah",
      value: String(totalSampah ?? 0),
      unit: "kg",
      icon: <Trash2 size={26} />,
      iconBg: "#9B7FE8",
      valueColor: "#9B7FE8",
    },
  ];

  const complaintData = [
    {
      status: "Baru",
      color: "#FFC5C5",
      textColor: "#C92525",
      iconColor: "#FF1313",
    },
    {
      status: "Diproses",
      color: "#FFF0B8",
      textColor: "#A6851A",
      iconColor: "#FFD21A",
    },
    {
      status: "Selesai",
      color: "#BDEFD0",
      textColor: "#2B8C4C",
      iconColor: "#2DA06D",
    },
  ];

  useEffect(() => {
    const fetchDataFull = async () => {
      try {
        const [wasteRes] = await Promise.all([apiService.getSampah()]);
        setAllWaste(wasteRes.data || []);
      } catch (error) {
        console.error("Gagal ambil data Full:", error);
      }
    };
    fetchDataFull();
  }, []);

  const wasteStats = useMemo(() => {
    const dataSelesai = allWaste.filter((item) => item.status === "SELESAI");
    const totalKeseluruhan = dataSelesai.reduce(
      (sum, item) => sum + (parseFloat(item.berat) || 0),
      0,
    );

    const map = dataSelesai.reduce((acc, curr) => {
      const name = curr.kategori?.namaKategori || "Lainnya";
      acc[name] = (acc[name] || 0) + (parseFloat(curr.berat) || 0);
      return acc;
    }, {});

    return Object.keys(map).map((label) => ({
      label: label,
      value: map[label],
      percentage:
        totalKeseluruhan > 0
          ? ((map[label] / totalKeseluruhan) * 100).toFixed(1)
          : 0,
    }));
  }, [allWaste]);

  const totalSampahFull = useMemo(() => {
    return allWaste
      .filter((item) => item.status === "SELESAI")
      .reduce((sum, item) => sum + (parseFloat(item.berat) || 0), 0);
  }, [allWaste]);

  const donutChartData = useMemo(
    () => ({
      labels: wasteStats.map((item) => item.label),
      datasets: [
        {
          data: wasteStats.map((item) => item.value),
          backgroundColor: [
            "#064D36",
            "#FF9F43",
            "#3B82F6",
            "#EF4444",
            "#10B981",
          ],
          borderWidth: 0,
          cutout: "75%",
        },
      ],
    }),
    [wasteStats],
  );

  return (
    <div style={styles.container}>
      <AdminSidebar activeMenu="dashboard" />

      <main style={styles.main}>
        <div style={styles.contentWrapper}>
          <section style={styles.topSection}>
            <div>
              <h1 style={styles.pageTitle}>
                Halo, <span style={styles.greenText}>{userName}!</span>
              </h1>
              <p style={styles.subtitle}>
                Kelola seluruh sistem TerraLog secara terorganisir.
              </p>
            </div>

            <div style={styles.topActions}>
              <div style={styles.datePill}>{todayDisplay}</div>
            </div>
          </section>

          <section style={styles.statsGrid}>
            {statsData.map((item) => (
              <StatCard key={item.title} item={item} />
            ))}
          </section>

          <section style={styles.middleGrid}>
            <div style={styles.cardLarge}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Peta Lokasi TPS</h3>
              </div>

              <div style={styles.mapBox}>
                <div style={styles.mapFake}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.3534521786164!2d106.9976916!3d-6.3482596!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6993db0ada747d%3A0x85e0801c6190eb2d!2sTPST%20Bantar%20Gebang!5e0!3m2!1sen!2sid!4v1779802984725!5m2!1sen!2sid"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
            <div style={styles.cardLarge}>
              <div style={styles.cardHeaderPickup}>
                <h3 style={styles.cardTitle}>Lokasi Pengambilan Hari Ini</h3>
                <span style={styles.locationBadge}>
                  {filteredData.length} lokasi
                </span>
              </div>
              <div style={styles.pickupList}>
                {loading ? (
                  <p>Memuat lokasi...</p>
                ) : filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <PickupItem key={item.idJadwal || index} item={item} />
                  ))
                ) : (
                  <p>Tidak ada jadwal pengambilan untuk hari ini.</p>
                )}
              </div>
            </div>
          </section>

          <section style={styles.statistikCard}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Statistik Sampah</h3>
            </div>
            <div style={styles.donutContent}>
              <div style={styles.donutChart}>
                <Doughnut
                  data={donutChartData}
                  options={{
                    responsive: true,
                    plugins: { legend: { display: false } },
                  }}
                />
                <div style={styles.donutCenter}>
                  <strong style={{ fontSize: "12px", color: "#666" }}>
                    Total
                  </strong>
                  <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                    {(totalSampahFull ?? 0).toLocaleString()} kg
                  </span>
                </div>
              </div>

              <div style={styles.legendList}>
                {wasteStats.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span
                        style={{
                          width: "12px",
                          height: "12px",
                          backgroundColor:
                            donutChartData.datasets[0].backgroundColor[index] ||
                            "#ccc",
                          borderRadius: "50%",
                          marginRight: "10px",
                        }}
                      ></span>
                      <span
                        style={{
                          fontWeight: "600",
                          color: "#333",
                          fontSize: "14px",
                        }}
                      >
                        {item.label}
                      </span>
                    </div>
                    <span
                      style={{
                        fontWeight: "700",
                        color: "#064D36",
                        fontSize: "14px",
                      }}
                    >
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ item }) => (
  <div style={styles.statCard}>
    <div style={{ ...styles.statIcon, backgroundColor: item.iconBg }}>
      {React.cloneElement(item.icon, { color: "#fff" })}
    </div>

    <div>
      <h3 style={styles.statTitle}>{item.title}</h3>

      <div style={styles.statValueWrap}>
        <span style={{ ...styles.statValue, color: item.valueColor }}>
          {item.value}
        </span>
        <span style={styles.statUnit}>{item.unit}</span>
      </div>
    </div>
  </div>
);

const PickupItem = ({ item }) => (
  <div style={styles.pickupItem}>
    <div
      style={{
        ...styles.pickupIcon,
        backgroundColor: `${item.iconColor || "#ccc"}22`,
      }}
    >
      <Truck size={28} color={item.iconColor || "#333"} />
    </div>

    <div style={styles.pickupText}>
      <strong>{item.lokasiTugas}</strong>
      <span>Shift: {item.shift}</span>
    </div>

    <span
      style={{
        ...styles.statusBadge,
        backgroundColor: item.color || "#e0e0e0",
        color: item.textColor || "#000",
      }}
    >
      {item.shift === "Pagi" ? "Pagi" : "Malam"}
    </span>
  </div>
);

const ComplaintItem = ({ item }) => (
  <div style={styles.complaintItem}>
    <div style={{ ...styles.complaintIcon, backgroundColor: item.iconColor }}>
      <Package size={28} color="#fff" />
    </div>

    <div style={styles.complaintText}>
      <strong>Sampah menumpuk di sekitar TPS</strong>
      <span>Perumahan Cisitu Indah</span>
    </div>

    <span
      style={{
        ...styles.complaintBadge,
        backgroundColor: item.color,
        color: item.textColor,
      }}
    >
      {item.status}
    </span>
  </div>
);

const LegendItem = ({ item }) => (
  <div style={styles.legendItem}>
    <span style={{ ...styles.legendDot, backgroundColor: item.color }}></span>
    <span style={styles.legendLabel}>{item.label}</span>
    <strong style={styles.legendValue}>{item.value}</strong>
  </div>
);

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#064D36",
    fontFamily: "'Poppins', sans-serif",
  },
  main: {
    marginLeft: "270px",
    minHeight: "100vh",
    padding: "24px 24px 24px 0",
    boxSizing: "border-box",
  },
  contentWrapper: {
    minHeight: "calc(100vh - 48px)",
    backgroundColor: "#fff",
    borderRadius: "38px 38px 38px 38px",
    padding: "34px 40px 40px 40px",
    boxSizing: "border-box",
  },
  topSection: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "25px",
    marginBottom: "28px",
  },
  pageTitle: {
    fontSize: "38px",
    lineHeight: "1",
    margin: "0 0 12px 0",
    color: "#111",
    fontWeight: "900",
  },
  greenText: {
    color: "#064D36",
  },
  subtitle: {
    margin: 0,
    fontSize: "17px",
    color: "#8A8A8A",
    fontWeight: "400",
  },
  topActions: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    flexWrap: "nowrap",
  },
  datePill: {
    width: "400px",
    height: "44px",
    backgroundColor: "#064D36",
    color: "#fff",
    borderRadius: "25px",
    display: "flex",
    alignItems: "center",
    paddingLeft: "28px",
    boxSizing: "border-box",
    fontSize: "15px",
    fontWeight: "600",
    marginRight: "30px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "26px",
    marginBottom: "26px",
  },
  statCard: {
    minHeight: "126px",
    backgroundColor: "#fff",
    borderRadius: "24px",
    border: "1px solid #E5E5E5",
    boxShadow: "0 2px 0 rgba(0,0,0,0.25)",
    padding: "22px",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
  },
  statIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  statTitle: {
    margin: "3px 0 8px 0",
    fontSize: "18px",
    color: "#111",
    fontWeight: "800",
  },
  statValueWrap: {
    display: "flex",
    alignItems: "flex-end",
    gap: "6px",
    marginBottom: "12px",
  },
  statValue: {
    fontSize: "40px",
    lineHeight: "0.85",
    fontWeight: "900",
  },
  statUnit: {
    fontSize: "15px",
    color: "#777",
    fontWeight: "600",
  },
  middleGrid: {
    display: "grid",
    gridTemplateColumns: "1.15fr 1fr",
    gap: "24px",
    marginBottom: "26px",
  },
  cardLarge: {
    backgroundColor: "#fff",
    border: "1px solid #DDDDDD",
    borderRadius: "24px",
    boxShadow: "0 2px 0 rgba(0,0,0,0.25)",
    overflow: "hidden",
  },
  cardHeader: {
    height: "43px",
    borderBottom: "1px solid #DDDDDD",
    display: "flex",
    alignItems: "center",
    padding: "0 24px",
  },
  cardHeaderPickup: {
    height: "43px",
    borderBottom: "1px solid #DDDDDD",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 22px 0 24px",
  },
  cardTitle: {
    margin: 0,
    fontSize: "15px",
    color: "#111",
    fontWeight: "800",
  },
  locationBadge: {
    minWidth: "110px",
    height: "26px",
    backgroundColor: "#EEEAFE",
    color: "#7B2CFF",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "800",
  },
  mapBox: {
    padding: "8px 14px 14px 14px",
  },
  mapFake: {
    height: "305px",
    width: "100%",
    borderRadius: "4px",
    overflow: "hidden",
    border: "1px solid #DCE4E7",
  },
  pickupList: {
    padding: "8px 12px 14px 12px",
  },
  pickupItem: {
    height: "58px",
    borderBottom: "1px solid #D9D9D9",
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  pickupIcon: {
    width: "62px",
    height: "42px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  pickupText: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  statusBadge: {
    minWidth: "110px",
    height: "32px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "600",
  },
  chartContent: {
    minHeight: "240px",
    display: "grid",
    gridTemplateColumns: "240px 1fr",
    alignItems: "center",
    gap: "10px",
    padding: "24px 32px",
  },
  donutChart: {
    position: "relative",
    width: "180px",
    height: "180px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
  },
  donutCenter: {
    position: "absolute",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    pointerEvents: "none",
  },
  legendList: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  statistikCard: {
    width: "610px",
    border: "1px solid #D5D5D5",
    borderRadius: "22px",
    overflow: "hidden",
    backgroundColor: "#fff",
    boxShadow: "0 2px 0 rgba(0,0,0,0.2)",
  },
  donutContent: {
    minHeight: "240px",
    display: "grid",
    gridTemplateColumns: "240px 1fr",
    alignItems: "center",
    gap: "12px",
    padding: "24px 32px",
  },
};

export default AdminDashboard;
