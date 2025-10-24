import { DataTable } from "@/components/data-table";
import { SiteHeader } from "@/components/site-header";
import data from "./data.json";
import { SidebarInset } from "@/components/ui/sidebar";

export default function Home() {
  return (
    <>
      <SidebarInset>
        <div className="flex flex-col flex-1 w-full min-h-screen">
          < SiteHeader />
          <main className="flex flex-1 flex-col w-full px-4 py-6">
            <div className="flex flex-col flex-1 w-full gap-6">
              <DataTable data={data} />
            </div>
          </main>
        </div>
      </SidebarInset>
    </>
  );
}
