
import PageMeta from "../../components/common/PageMeta"
import { BoxIconLine, GroupIcon } from "../../icons";
import { useAtom } from "jotai";
import { usersQueryAtom } from "../../atoms/queries/usersQuery";
import { ordersQueryAtom } from "../../atoms/queries/ordersQuery";
import Skeleton from "react-loading-skeleton";
import { vehiclesQueryAtom } from "../../atoms/queries/vehiclesQuery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar } from "@fortawesome/free-solid-svg-icons";

export default function Home() {

  const [{ data: userdata, isPending: usersIsPending }] = useAtom(usersQueryAtom)
  const [{ data: ordersData, isPending: ordersIsPending}] = useAtom(ordersQueryAtom)
  const [{ data: vehiclesData, isPending: vehiclesIsPending }] = useAtom(vehiclesQueryAtom)

  return (
    <>
      <PageMeta title="Fajar Garage App - Dashboard" description="" />
      <div className="grid gap-4 md:gap-6">
        <div className="col-span-12 gap-y-6 gap-x-4 xl:col-span-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {/* <!-- Metric Item Start --> */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
            </div>

            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Total Pengguna
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {!usersIsPending ? userdata.data.length : <Skeleton width={20} height={20} className="bg-gray-500 animate-pulse" />}
                </h4>
              </div>
            </div>
          </div>
          {/* <!-- Metric Item End --> */}
          {/* <!-- Metric Item Start --> */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
            </div>

            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Total Pesanan
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {!ordersIsPending ? ordersData.data.length : <Skeleton width={20} height={20} className="bg-gray-500 animate-pulse" />}
                </h4>
              </div>
            </div>
          </div>
          {/* <!-- Metric Item End --> */}
          {/* <!-- Metric Item Start --> */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <FontAwesomeIcon icon={faCar} className="text-black dark:text-white" />
            </div>

            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Total Kendaraan terdaftar
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {!vehiclesIsPending ? vehiclesData.data.length : <Skeleton width={20} height={20} className="bg-gray-500 animate-pulse" />}
                </h4>
              </div>
            </div>
          </div>
          {/* <!-- Metric Item End --> */}
        </div>

        {/* <div className="col-span-12 space-y-6 xl:col-span-7">
          <StatisticsChart />
        </div> */}
      </div>
    </>
  );
}
