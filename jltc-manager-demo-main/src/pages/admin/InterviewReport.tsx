
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InterviewList from "@/components/admin/InterviewList";
import JobOrders from "@/components/admin/JobOrders";

const InterviewReport = () => {
    return (
        <div className="space-y-6">


            <Tabs defaultValue="interviews" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="interviews">Danh sách phỏng vấn</TabsTrigger>
                    <TabsTrigger value="orders">Quản lý đơn hàng</TabsTrigger>
                </TabsList>

                <TabsContent value="interviews" className="mt-4">
                    <InterviewList />
                </TabsContent>

                <TabsContent value="orders" className="mt-4">
                    <JobOrders />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default InterviewReport;
