import PageMeta from "../../components/common/PageMeta";
import { BoxIconLine, DollarLineIcon, GroupIcon, TimeIcon } from "../../icons";
import { useAtom } from "jotai";
import { usersQueryAtom } from "../../atoms/queries/usersQuery";
import { ordersQueryAtom } from "../../atoms/queries/ordersQuery";
import Skeleton from "react-loading-skeleton";
import { vehiclesQueryAtom } from "../../atoms/queries/vehiclesQuery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar } from "@fortawesome/free-solid-svg-icons";
import MetricCard from "../../components/ecommerce/MetricCard";
import { statisticQueryAtom } from "../../atoms/queries/statisticsQuery";
import { useEffect } from "react";
import { formatCurrency, formatTime } from "../../utils/converter";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import { DEFAULT_STATISTICS_TRENDS_DATA } from "../../constants/StatisticsConstants";
import { tokenAtom } from "../../atoms/auth";
import { useNavigate } from "react-router";

export default function Home() {
  const [{ data: userdata, isPending: usersIsPending }] =
    useAtom(usersQueryAtom);
  const [{ data: ordersData, isPending: ordersIsPending }] =
    useAtom(ordersQueryAtom);
  const [{ data: vehiclesData, isPending: vehiclesIsPending }] =
    useAtom(vehiclesQueryAtom);

  const [{ data: statisticData, isPending: statisticIsPending }] =
    useAtom(statisticQueryAtom);

  const navigate = useNavigate()
  const [token,]  = useAtom(tokenAtom)


  useEffect(() => {
    const verifyToken = async() => {
      
      if (!token) return

      await fetch(`${import.meta.env.VITE_BASE_API_URL}/pesanan`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
          if (res.status == 401) {
            navigate("/signin")
          }
        })
    }

    verifyToken()
  }, [token])

  return (
    <>
      <PageMeta title="Fajar Garage App - Dashboard" description="" />
      <section className="grid gap-4 md:gap-6">
        <div className="col-span-12 gap-y-6 gap-x-4 xl:col-span-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            title="Total Pengguna"
            data={(userdata && userdata.data) ? userdata.data.length : ""}
            // data={JSON.stringify(userdata)}
            isPending={usersIsPending}
            icon={
              <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
            }
          />

          <MetricCard
            title="Total Pesanan"
            data={ordersData ? ordersData.data.length : ""}
            isPending={ordersIsPending}
            icon={
              <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
            }
          />

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <FontAwesomeIcon
                icon={faCar}
                className="text-black dark:text-white"
              />
            </div>

            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Total Kendaraan terdaftar
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {!vehiclesIsPending ? (
                    vehiclesData.data.length
                  ) : (
                    <Skeleton
                      width={20}
                      height={20}
                      className="bg-gray-500 animate-pulse"
                    />
                  )}
                </h4>
              </div>
            </div>
          </div>
          {/* <!-- Metric Item End --> */}
        </div>
      </section>

      {/* financials */}
      <section className=" gap-x-4 mt-20">
        <h2 className="text-white font-semibold text-xl col-span-2">
          Keuangan
        </h2>

        <div className="grid grid-cols-2 gap-x-4 mt-8">
          <MetricCard
            title="Pendapatan Total"
            data={
              statisticData
                ? formatCurrency(statisticData.data.keuangan.pendapatan_total)
                : ""
            }
            isPending={statisticIsPending}
            icon={
              <DollarLineIcon className="text-gray-800 size-6 dark:text-white/90" />
            }
          />
          <MetricCard
            title="Rata-Rata Biaya"
            data={
              statisticData
                ? formatCurrency(statisticData.data.keuangan.rata_rata_biaya)
                : ""
            }
            isPending={statisticIsPending}
            icon={
              <DollarLineIcon className="text-gray-800 size-6 dark:text-white/90" />
            }
          />
        </div>
      </section>

      {/* performance */}
      <section className="gap-x-4 mt-20">
        <h2 className="text-white font-semibold text-xl col-span-2">
          Performa
        </h2>

        <div className="grid grid-cols-2 gap-x-4 mt-8">
          <MetricCard
            title="Rata-Rata Waktu Tunggu"
            data={
              statisticData
                ? formatTime(statisticData.data.keuangan.pendapatan_total)
                : ""
            }
            isPending={statisticIsPending}
            icon={
              <TimeIcon className="text-gray-800 size-6 dark:text-white/90" />
            }
          />
          <MetricCard
            title="Rata-Rata Waktu Perbaikan"
            data={
              statisticData
                ? formatTime(statisticData.data.keuangan.rata_rata_biaya)
                : ""
            }
            isPending={statisticIsPending}
            icon={
              <TimeIcon className="text-gray-800 size-6 dark:text-white/90" />
            }
          />
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-white font-semibold text-xl col-span-2">
          Statistik Trending
        </h2>

        <div className="col-span-12 space-y-6 xl:col-span-7 mt-8">
          <StatisticsChart trenBulanan={statisticData ? statisticData.data.tren_bulanan : DEFAULT_STATISTICS_TRENDS_DATA}  />
        </div>
      </section>
    </>
  );
}
