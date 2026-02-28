import React, { useState, useMemo, useCallback } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Users,
    Phone,
    Search,
    LayoutGrid,
    List,
    TrendingUp,
    DollarSign,
    UserPlus,
    FileCheck,
    MessageSquarePlus,
    ArrowRightLeft,
    ChevronRight,
    Globe,
    MessageCircle,
    Facebook,
    Headphones,
    CheckCircle2,
    Circle,
    StickyNote,
    Briefcase,
    MapPin,
    Building2,
    BadgeCheck,
    ChevronsRight,
    UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ==================== TYPES ====================

type LeadStatus = "new" | "contacting" | "consulting" | "deposit" | "enrollment" | "departed" | "failed";
type LeadCategory = "du_hoc" | "thuc_tap" | "ky_su" | "tokutei" | "tieng_nhat" | "xkld";
type LeadSource = "zalo" | "web" | "facebook" | "hotline";

interface LeadDocument {
    passport: boolean;
    coe: boolean;
    visa: boolean;
    healthCert: boolean;
}

interface LeadFinancial {
    deposit: number;
    processingFee: number;
    finalPayment: number;
    paid: number;
}

interface Lead {
    id: number;
    name: string;
    phone: string;
    email: string;
    source: LeadSource;
    category: LeadCategory;
    status: LeadStatus;
    height?: number;
    weight?: number;
    education: string;
    japaneseLevel: string;
    notes: string;
    documents: LeadDocument;
    financials: LeadFinancial;
    createdAt: string;
    assignedOrderId?: string;
    saleId: string;
}

// ==================== SALESPEOPLE ====================

interface Salesperson {
    id: string;
    name: string;
    phone: string;
    email: string;
    avatar: string;
}

const SALESPEOPLE: Salesperson[] = [
    { id: "s1", name: "Nguyễn Thị Lan", phone: "0901111222", email: "lan.nguyen@ikigai.vn", avatar: "NL" },
    { id: "s2", name: "Trần Văn Hùng", phone: "0902222333", email: "hung.tran@ikigai.vn", avatar: "TH" },
    { id: "s3", name: "Lê Thị Mai", phone: "0903333444", email: "mai.le@ikigai.vn", avatar: "LM" },
    { id: "s4", name: "Phạm Văn Đạt", phone: "0904444555", email: "dat.pham@ikigai.vn", avatar: "PĐ" },
    { id: "s5", name: "Hoàng Thị Như", phone: "0905555666", email: "nhu.hoang@ikigai.vn", avatar: "HN" },
];

// ==================== JOB ORDERS ====================

interface JobOrder {
    id: string;
    code: string;
    companyName: string;
    jobTitle: string;
    industry: string;
    quantity: number;
    filled: number;
    salary: string;
    location: string;
    status: "open" | "closed" | "pending";
    requirements: string;
}

const JOB_ORDERS: JobOrder[] = [
    { id: "1", code: "DH001", companyName: "Toyota Auto Body", jobTitle: "Lắp ráp ô tô", industry: "Cơ khí", quantity: 15, filled: 8, salary: "160,000¥/tháng", location: "Aichi", status: "open", requirements: "Nam, 20-30t, THPT, N5+" },
    { id: "2", code: "DH002", companyName: "Panasonic Electronics", jobTitle: "Lắp ráp linh kiện", industry: "Điện tử", quantity: 30, filled: 22, salary: "155,000¥/tháng", location: "Osaka", status: "open", requirements: "Nam/Nữ, 20-35t, N4+" },
    { id: "3", code: "DH003", companyName: "Seven Foods Co.", jobTitle: "Chế biến thực phẩm", industry: "Thực phẩm", quantity: 20, filled: 20, salary: "150,000¥/tháng", location: "Tokyo", status: "closed", requirements: "Nữ, 20-30t, sức khỏe tốt" },
    { id: "4", code: "DH004", companyName: "Shimizu Construction", jobTitle: "Xây dựng", industry: "Xây dựng", quantity: 10, filled: 3, salary: "180,000¥/tháng", location: "Fukuoka", status: "open", requirements: "Nam, 20-35t, thể lực tốt, N5+" },
    { id: "5", code: "DH005", companyName: "Hokkaido Farm Corp", jobTitle: "Nông nghiệp", industry: "Nông nghiệp", quantity: 12, filled: 5, salary: "145,000¥/tháng", location: "Hokkaido", status: "open", requirements: "Nam/Nữ, 20-35t, chịu khó" },
    { id: "6", code: "DH006", companyName: "Maruha Nichiro", jobTitle: "Chế biến thủy sản", industry: "Thủy sản", quantity: 25, filled: 10, salary: "155,000¥/tháng", location: "Hokkaido", status: "open", requirements: "Nam/Nữ, 20-30t, N5+" },
    { id: "7", code: "DH007", companyName: "Suzuki Textile", jobTitle: "May mặc", industry: "Dệt may", quantity: 18, filled: 12, salary: "148,000¥/tháng", location: "Hiroshima", status: "open", requirements: "Nữ, 20-30t, khéo tay" },
    { id: "8", code: "DH008", companyName: "Nagoya Hotel Group", jobTitle: "Nhà hàng khách sạn", industry: "Dịch vụ", quantity: 8, filled: 2, salary: "170,000¥/tháng", location: "Nagoya", status: "open", requirements: "Nam/Nữ, N4+, giao tiếp tốt" },
    { id: "9", code: "DH009", companyName: "Kobe Steel Works", jobTitle: "Hàn xì công nghiệp", industry: "Cơ khí", quantity: 6, filled: 6, salary: "185,000¥/tháng", location: "Kobe", status: "closed", requirements: "Nam, chứng chỉ hàn, N4+" },
    { id: "10", code: "DH010", companyName: "Saitama Care Center", jobTitle: "Điều dưỡng", industry: "Y tế", quantity: 10, filled: 4, salary: "190,000¥/tháng", location: "Saitama", status: "open", requirements: "Nam/Nữ, Cao đẳng+, N3+" },
];

// ==================== CONFIG ==

const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; bg: string; border: string }> = {
    new: { label: "Mới", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
    contacting: { label: "Đang liên hệ", color: "text-cyan-700", bg: "bg-cyan-50", border: "border-cyan-200" },
    consulting: { label: "Đang tư vấn", color: "text-violet-700", bg: "bg-violet-50", border: "border-violet-200" },
    deposit: { label: "Đặt cọc", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
    enrollment: { label: "Nhập học", color: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-200" },
    departed: { label: "Xuất cảnh", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
    failed: { label: "Thất bại", color: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200" },
};

const CATEGORY_CONFIG: Record<LeadCategory, { label: string; color: string; bg: string; border: string }> = {
    du_hoc: { label: "Du học sinh", color: "text-blue-700", bg: "bg-blue-100", border: "border-blue-300" },
    thuc_tap: { label: "Thực tập sinh", color: "text-orange-700", bg: "bg-orange-100", border: "border-orange-300" },
    ky_su: { label: "Kỹ sư", color: "text-emerald-700", bg: "bg-emerald-100", border: "border-emerald-300" },
    tokutei: { label: "Tokutei", color: "text-violet-700", bg: "bg-violet-100", border: "border-violet-300" },
    tieng_nhat: { label: "Tiếng Nhật", color: "text-cyan-700", bg: "bg-cyan-100", border: "border-cyan-300" },
    xkld: { label: "XKLĐ", color: "text-amber-700", bg: "bg-amber-100", border: "border-amber-300" },
};

const SOURCE_CONFIG: Record<LeadSource, { label: string; icon: React.ElementType; color: string }> = {
    zalo: { label: "Zalo", icon: MessageCircle, color: "text-blue-600" },
    web: { label: "Website", icon: Globe, color: "text-emerald-600" },
    facebook: { label: "Facebook", icon: Facebook, color: "text-indigo-600" },
    hotline: { label: "Hotline", icon: Headphones, color: "text-rose-600" },
};

const STATUS_ORDER: LeadStatus[] = ["new", "contacting", "consulting", "deposit", "enrollment", "departed", "failed"];

// ==================== MOCK DATA ====================

const mockLeads: Lead[] = [
    { id: 1, name: "Nguyễn Văn An", phone: "0912345678", email: "an.nguyen@gmail.com", source: "zalo", category: "thuc_tap", status: "new", height: 170, weight: 65, education: "THPT", japaneseLevel: "N5", notes: "Quan tâm đơn hàng xây dựng ở Saitama. Cần tư vấn thêm về lương.", documents: { passport: false, coe: false, visa: false, healthCert: false }, financials: { deposit: 0, processingFee: 0, finalPayment: 0, paid: 0 }, createdAt: "2026-02-20", saleId: "s1" },
    { id: 2, name: "Trần Thị Bích", phone: "0923456789", email: "bich.tran@gmail.com", source: "facebook", category: "du_hoc", status: "contacting", education: "Đại học", japaneseLevel: "N4", notes: "Muốn du học ngành IT tại Tokyo. Đã liên hệ lần 1.", documents: { passport: true, coe: false, visa: false, healthCert: false }, financials: { deposit: 0, processingFee: 0, finalPayment: 0, paid: 0 }, createdAt: "2026-02-18", saleId: "s2" },
    { id: 3, name: "Lê Hoàng Cường", phone: "0934567890", email: "cuong.le@gmail.com", source: "web", category: "ky_su", status: "consulting", height: 175, weight: 70, education: "Đại học - CNTT", japaneseLevel: "N3", notes: "Kỹ sư phần mềm 3 năm kinh nghiệm. Đang chờ matching đơn hàng phù hợp.", documents: { passport: true, coe: false, visa: false, healthCert: true }, financials: { deposit: 0, processingFee: 0, finalPayment: 0, paid: 0 }, createdAt: "2026-02-15", saleId: "s1" },
    { id: 4, name: "Phạm Thị Dung", phone: "0945678901", email: "dung.pham@gmail.com", source: "hotline", category: "xkld", status: "deposit", height: 158, weight: 52, education: "THPT", japaneseLevel: "N5", notes: "Đã đặt cọc 20tr. Chuẩn bị hồ sơ COE cho đơn hàng chế biến thực phẩm.", documents: { passport: true, coe: false, visa: false, healthCert: true }, financials: { deposit: 20000000, processingFee: 45000000, finalPayment: 80000000, paid: 20000000 }, createdAt: "2026-02-10", assignedOrderId: "3", saleId: "s3" },
    { id: 5, name: "Hoàng Minh Đức", phone: "0956789012", email: "duc.hoang@gmail.com", source: "zalo", category: "tokutei", status: "enrollment", height: 168, weight: 62, education: "Cao đẳng", japaneseLevel: "N4", notes: "Đang học tiếng Nhật tại trung tâm. Mục tiêu N3 trước khi xuất cảnh. Đơn hàng nông nghiệp Hokkaido.", documents: { passport: true, coe: true, visa: false, healthCert: true }, financials: { deposit: 25000000, processingFee: 50000000, finalPayment: 90000000, paid: 50000000 }, createdAt: "2026-01-20", assignedOrderId: "5", saleId: "s2" },
    { id: 6, name: "Vũ Thị Hoa", phone: "0967890123", email: "hoa.vu@gmail.com", source: "facebook", category: "tieng_nhat", status: "new", education: "Đại học", japaneseLevel: "N5", notes: "Muốn học tiếng Nhật để chuẩn bị đi du học năm sau.", documents: { passport: false, coe: false, visa: false, healthCert: false }, financials: { deposit: 0, processingFee: 0, finalPayment: 0, paid: 0 }, createdAt: "2026-02-22", saleId: "s4" },
    { id: 7, name: "Đỗ Quang Huy", phone: "0978901234", email: "huy.do@gmail.com", source: "web", category: "thuc_tap", status: "departed", height: 172, weight: 68, education: "Trung cấp - Cơ khí", japaneseLevel: "N4", notes: "Đã xuất cảnh 15/01/2026. Đơn hàng cơ khí tại Osaka. Thanh toán đầy đủ.", documents: { passport: true, coe: true, visa: true, healthCert: true }, financials: { deposit: 20000000, processingFee: 45000000, finalPayment: 75000000, paid: 75000000 }, createdAt: "2025-10-05", assignedOrderId: "1", saleId: "s1" },
    { id: 8, name: "Ngô Thanh Lan", phone: "0989012345", email: "lan.ngo@gmail.com", source: "hotline", category: "du_hoc", status: "consulting", education: "THPT", japaneseLevel: "N4", notes: "Đang tư vấn chương trình du học vừa học vừa làm tại Fukuoka.", documents: { passport: true, coe: false, visa: false, healthCert: false }, financials: { deposit: 0, processingFee: 0, finalPayment: 0, paid: 0 }, createdAt: "2026-02-12", saleId: "s5" },
    { id: 9, name: "Bùi Văn Mạnh", phone: "0990123456", email: "manh.bui@gmail.com", source: "zalo", category: "xkld", status: "failed", height: 165, weight: 58, education: "THCS", japaneseLevel: "Chưa có", notes: "Không đạt yêu cầu sức khỏe (thị lực). Đã hoàn cọc.", documents: { passport: true, coe: false, visa: false, healthCert: false }, financials: { deposit: 20000000, processingFee: 0, finalPayment: 0, paid: 0 }, createdAt: "2026-01-05", saleId: "s3" },
    { id: 10, name: "Đinh Thị Ngọc", phone: "0901234567", email: "ngoc.dinh@gmail.com", source: "facebook", category: "ky_su", status: "deposit", height: 160, weight: 50, education: "Đại học - Điện tử", japaneseLevel: "N3", notes: "Kỹ sư điện tử, 2 năm KN. Đã đặt cọc. Đang chờ COE từ công ty Nhật.", documents: { passport: true, coe: false, visa: false, healthCert: true }, financials: { deposit: 30000000, processingFee: 60000000, finalPayment: 100000000, paid: 30000000 }, createdAt: "2026-02-01", saleId: "s2" },
    { id: 11, name: "Trương Văn Phúc", phone: "0911223344", email: "phuc.truong@gmail.com", source: "web", category: "tokutei", status: "contacting", height: 173, weight: 66, education: "Cao đẳng - Nhà hàng", japaneseLevel: "N4", notes: "Có kinh nghiệm làm bếp 2 năm. Quan tâm Tokutei ngành ẩm thực.", documents: { passport: false, coe: false, visa: false, healthCert: false }, financials: { deposit: 0, processingFee: 0, finalPayment: 0, paid: 0 }, createdAt: "2026-02-19", saleId: "s4" },
    { id: 12, name: "Lý Thị Quỳnh", phone: "0922334455", email: "quynh.ly@gmail.com", source: "zalo", category: "tieng_nhat", status: "enrollment", education: "Đại học", japaneseLevel: "N3", notes: "Đang học khóa N2 tại trung tâm. Dự kiến thi 07/2026.", documents: { passport: false, coe: false, visa: false, healthCert: false }, financials: { deposit: 5000000, processingFee: 15000000, finalPayment: 15000000, paid: 10000000 }, createdAt: "2026-01-15", saleId: "s5" },
    { id: 13, name: "Phan Hữu Sơn", phone: "0933445566", email: "son.phan@gmail.com", source: "hotline", category: "thuc_tap", status: "enrollment", height: 175, weight: 72, education: "THPT", japaneseLevel: "N5", notes: "Đang học tiếng tại trung tâm. Mục tiêu xuất cảnh 06/2026. Đơn hàng xây dựng Nagoya.", documents: { passport: true, coe: true, visa: false, healthCert: true }, financials: { deposit: 20000000, processingFee: 45000000, finalPayment: 80000000, paid: 45000000 }, createdAt: "2025-12-01", assignedOrderId: "4", saleId: "s1" },
    { id: 14, name: "Mai Thị Tâm", phone: "0944556677", email: "tam.mai@gmail.com", source: "facebook", category: "du_hoc", status: "departed", education: "Đại học - Kinh tế", japaneseLevel: "N3", notes: "Đã xuất cảnh 01/02/2026. Du học ngành quản trị kinh doanh tại Đại học Waseda.", documents: { passport: true, coe: true, visa: true, healthCert: true }, financials: { deposit: 30000000, processingFee: 50000000, finalPayment: 120000000, paid: 120000000 }, createdAt: "2025-08-15", saleId: "s3" },
    { id: 15, name: "Cao Văn Uy", phone: "0955667788", email: "uy.cao@gmail.com", source: "web", category: "xkld", status: "new", height: 178, weight: 75, education: "THPT", japaneseLevel: "Chưa có", notes: "Mới đăng ký qua web. Quan tâm đơn hàng cơ khí hoặc xây dựng.", documents: { passport: false, coe: false, visa: false, healthCert: false }, financials: { deposit: 0, processingFee: 0, finalPayment: 0, paid: 0 }, createdAt: "2026-02-24", saleId: "s2" },
    { id: 16, name: "Đặng Thị Vân", phone: "0966778899", email: "van.dang@gmail.com", source: "zalo", category: "ky_su", status: "consulting", height: 162, weight: 53, education: "Đại học - Xây dựng", japaneseLevel: "N2", notes: "Kỹ sư xây dựng 5 năm KN, N2. Đang chờ matching với công ty lớn tại Tokyo.", documents: { passport: true, coe: false, visa: false, healthCert: true }, financials: { deposit: 0, processingFee: 0, finalPayment: 0, paid: 0 }, createdAt: "2026-02-08", saleId: "s4" },
    { id: 17, name: "Hồ Minh Xuân", phone: "0977889900", email: "xuan.ho@gmail.com", source: "hotline", category: "tokutei", status: "failed", height: 167, weight: 60, education: "Trung cấp", japaneseLevel: "N4", notes: "Rớt phỏng vấn với công ty Nhật lần 2. Đang xem xét đơn hàng khác.", documents: { passport: true, coe: false, visa: false, healthCert: true }, financials: { deposit: 15000000, processingFee: 0, finalPayment: 0, paid: 15000000 }, createdAt: "2026-01-10", saleId: "s5" },
    { id: 18, name: "Lương Thị Yến", phone: "0988990011", email: "yen.luong@gmail.com", source: "facebook", category: "thuc_tap", status: "deposit", height: 155, weight: 48, education: "THPT", japaneseLevel: "N5", notes: "Đặt cọc cho đơn hàng may mặc tại Hiroshima. Chuẩn bị nộp hồ sơ COE.", documents: { passport: true, coe: false, visa: false, healthCert: false }, financials: { deposit: 20000000, processingFee: 40000000, finalPayment: 70000000, paid: 20000000 }, createdAt: "2026-02-05", assignedOrderId: "7", saleId: "s1" },
    { id: 19, name: "Tạ Đình Gia", phone: "0999001122", email: "gia.ta@gmail.com", source: "web", category: "du_hoc", status: "new", education: "THPT", japaneseLevel: "Chưa có", notes: "Học sinh lớp 12, muốn du học sau khi tốt nghiệp. Gia đình rất quan tâm.", documents: { passport: false, coe: false, visa: false, healthCert: false }, financials: { deposit: 0, processingFee: 0, finalPayment: 0, paid: 0 }, createdAt: "2026-02-23", saleId: "s3" },
    { id: 20, name: "Nguyễn Thị Hiền", phone: "0900112233", email: "hien.nguyen@gmail.com", source: "zalo", category: "xkld", status: "enrollment", height: 160, weight: 54, education: "THPT", japaneseLevel: "N5", notes: "Đang học tiếng tại trung tâm. Đơn hàng chế biến thủy sản Hokkaido. Dự kiến xuất cảnh 04/2026.", documents: { passport: true, coe: true, visa: false, healthCert: true }, financials: { deposit: 20000000, processingFee: 45000000, finalPayment: 85000000, paid: 50000000 }, createdAt: "2025-11-20", assignedOrderId: "6", saleId: "s2" },
];

// ==================== HELPER FUNCTIONS ====================

const formatCurrency = (amount: number): string => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(0)}tr`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}k`;
    return amount.toLocaleString("vi-VN");
};

// ==================== SUB-COMPONENTS ====================

// --- Lead Card for Kanban ---
const LeadCard: React.FC<{ lead: Lead; onClick: () => void; onDragStart: (e: React.DragEvent, leadId: number) => void; onMoveNext: (leadId: number) => void }> = ({ lead, onClick, onDragStart, onMoveNext }) => {
    const cat = CATEGORY_CONFIG[lead.category];
    const src = SOURCE_CONFIG[lead.source];
    const SrcIcon = src.icon;
    const sale = SALESPEOPLE.find(s => s.id === lead.saleId);
    const canMoveNext = lead.status !== "departed" && lead.status !== "failed";
    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, lead.id)}
            onClick={onClick}
            className="bg-card border rounded-lg p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow space-y-2 select-none"
        >
            <div className="flex items-start justify-between">
                <p className="font-semibold text-sm truncate flex-1">{lead.name}</p>
                <SrcIcon className={cn("w-3.5 h-3.5 flex-shrink-0 ml-1", src.color)} />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
                <Badge className={cn("text-[10px] px-1.5 py-0 border", cat.bg, cat.color, cat.border)}>{cat.label}</Badge>
                {lead.japaneseLevel !== "Chưa có" && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">{lead.japaneseLevel}</Badge>
                )}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <Phone className="w-3 h-3" />
                <span>{lead.phone}</span>
            </div>
            {sale && (
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <UserCog className="w-3 h-3" />
                    <span>{sale.name}</span>
                </div>
            )}
            {lead.notes && (
                <p className="text-[10px] text-muted-foreground line-clamp-2 italic">{lead.notes}</p>
            )}
            {canMoveNext && (
                <Button
                    size="sm"
                    variant="ghost"
                    className="w-full h-6 text-[10px] gap-1 text-primary hover:bg-primary/10 mt-1"
                    onClick={(e) => { e.stopPropagation(); onMoveNext(lead.id); }}
                >
                    <ChevronsRight className="w-3 h-3" />
                    {STATUS_CONFIG[STATUS_ORDER[STATUS_ORDER.indexOf(lead.status) + 1]]?.label}
                </Button>
            )}
        </div>
    );
};

// ==================== MAIN COMPONENT ====================

const EMPTY_FORM = {
    name: "", phone: "", email: "", source: "zalo" as LeadSource, category: "thuc_tap" as LeadCategory,
    education: "", japaneseLevel: "Chưa có", height: "", weight: "", notes: "",
};

const LeadManagement: React.FC = () => {
    const { toast } = useToast();
    const [leads, setLeads] = useState<Lead[]>(mockLeads);
    const [view, setView] = useState<"kanban" | "table">("kanban");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterSource, setFilterSource] = useState<string>("all");
    const [filterCategory, setFilterCategory] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [filterSale, setFilterSale] = useState<string>("all");
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [statusChangeOpen, setStatusChangeOpen] = useState(false);
    const [noteDialogOpen, setNoteDialogOpen] = useState(false);
    const [newNote, setNewNote] = useState("");
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [orderDialogOpen, setOrderDialogOpen] = useState(false);
    const [orderSearch, setOrderSearch] = useState("");
    const [dragOverStatus, setDragOverStatus] = useState<LeadStatus | null>(null);
    const [draggedLeadId, setDraggedLeadId] = useState<number | null>(null);

    const handleDragStart = useCallback((e: React.DragEvent, leadId: number) => {
        setDraggedLeadId(leadId);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", String(leadId));
        // Make the drag image slightly transparent
        if (e.currentTarget instanceof HTMLElement) {
            e.currentTarget.style.opacity = "0.5";
            setTimeout(() => { if (e.currentTarget instanceof HTMLElement) e.currentTarget.style.opacity = "1"; }, 0);
        }
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent, status: LeadStatus) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setDragOverStatus(status);
    }, []);

    const handleDragLeave = useCallback(() => {
        setDragOverStatus(null);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent, targetStatus: LeadStatus) => {
        e.preventDefault();
        setDragOverStatus(null);
        const leadId = parseInt(e.dataTransfer.getData("text/plain"));
        setDraggedLeadId(null);
        if (isNaN(leadId)) return;
        const lead = leads.find(l => l.id === leadId);
        if (!lead || lead.status === targetStatus) return;
        const fromLabel = STATUS_CONFIG[lead.status].label;
        const toLabel = STATUS_CONFIG[targetStatus].label;
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: targetStatus } : l));
        toast({ title: "Chuyển trạng thái", description: `${lead.name}: ${fromLabel} → ${toLabel}` });
    }, [leads, toast]);

    const updateForm = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

    const handleAddLead = () => {
        if (!form.name.trim() || !form.phone.trim()) {
            toast({ title: "Thiếu thông tin", description: "Vui lòng nhập họ tên và số điện thoại.", variant: "destructive" });
            return;
        }
        const newLead: Lead = {
            id: leads.length + 100,
            name: form.name.trim(),
            phone: form.phone.trim(),
            email: form.email.trim(),
            source: form.source,
            category: form.category,
            status: "new",
            height: form.height ? parseInt(form.height) : undefined,
            weight: form.weight ? parseInt(form.weight) : undefined,
            education: form.education || "Chưa rõ",
            japaneseLevel: form.japaneseLevel,
            notes: form.notes,
            documents: { passport: false, coe: false, visa: false, healthCert: false },
            financials: { deposit: 0, processingFee: 0, finalPayment: 0, paid: 0 },
            createdAt: new Date().toISOString().split("T")[0],
            saleId: "s1",
        };
        setLeads(prev => [newLead, ...prev]);
        setForm(EMPTY_FORM);
        setAddDialogOpen(false);
        toast({ title: "Thêm thành công!", description: `Lead "${newLead.name}" đã được thêm vào danh sách.` });
    };

    const handleAssignOrder = (orderId: string) => {
        if (!selectedLead) return;
        const order = JOB_ORDERS.find(o => o.id === orderId);
        setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, assignedOrderId: orderId } : l));
        setSelectedLead(prev => prev ? { ...prev, assignedOrderId: orderId } : prev);
        setOrderDialogOpen(false);
        toast({ title: "Gán đơn hàng thành công!", description: `Đã gán "${order?.code} - ${order?.jobTitle}" cho ${selectedLead.name}.` });
    };

    const handleRemoveOrder = () => {
        if (!selectedLead) return;
        setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, assignedOrderId: undefined } : l));
        setSelectedLead(prev => prev ? { ...prev, assignedOrderId: undefined } : prev);
        toast({ title: "Đã gỡ đơn hàng", description: `Đơn hàng của ${selectedLead.name} đã được gỡ.` });
    };

    // Filter leads
    const filteredLeads = useMemo(() => {
        return leads.filter((lead) => {
            if (searchQuery && !lead.name.toLowerCase().includes(searchQuery.toLowerCase()) && !lead.phone.includes(searchQuery)) return false;
            if (filterSource !== "all" && lead.source !== filterSource) return false;
            if (filterCategory !== "all" && lead.category !== filterCategory) return false;
            if (filterStatus !== "all" && lead.status !== filterStatus) return false;
            if (filterSale !== "all" && lead.saleId !== filterSale) return false;
            return true;
        });
    }, [leads, searchQuery, filterSource, filterCategory, filterStatus, filterSale]);

    // Move lead to next status
    const handleMoveNext = useCallback((leadId: number) => {
        const lead = leads.find(l => l.id === leadId);
        if (!lead) return;
        const currentIdx = STATUS_ORDER.indexOf(lead.status);
        if (currentIdx < 0 || currentIdx >= STATUS_ORDER.length - 2) return; // don't move past 'departed', skip 'failed'
        const nextStatus = STATUS_ORDER[currentIdx + 1];
        if (nextStatus === "failed") return;
        const fromLabel = STATUS_CONFIG[lead.status].label;
        const toLabel = STATUS_CONFIG[nextStatus].label;
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: nextStatus } : l));
        toast({ title: "Chuyển trạng thái", description: `${lead.name}: ${fromLabel} → ${toLabel}` });
    }, [leads, toast]);

    // Dashboard stats
    const totalLeads = leads.length;
    const depositCount = leads.filter(l => l.status === "deposit").length;
    const enrollmentCount = leads.filter(l => l.status === "enrollment").length;
    const departedCount = leads.filter(l => l.status === "departed").length;

    const handleLeadClick = (lead: Lead) => {
        setSelectedLead(lead);
        setDialogOpen(true);
    };

    // Group leads by status for Kanban
    const kanbanData = useMemo(() => {
        const grouped: Record<LeadStatus, Lead[]> = {
            new: [], contacting: [], consulting: [], deposit: [], enrollment: [], departed: [], failed: [],
        };
        filteredLeads.forEach((lead) => {
            grouped[lead.status].push(lead);
        });
        return grouped;
    }, [filteredLeads]);

    return (
        <AdminLayout>
            <div className="space-y-4">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Quản lý Lead</h1>
                        <p className="text-sm text-muted-foreground">Theo dõi và quản lý khách hàng tiềm năng</p>
                    </div>
                    <Button className="gap-2" onClick={() => { setForm(EMPTY_FORM); setAddDialogOpen(true); }}>
                        <UserPlus className="w-4 h-4" />
                        Thêm Lead mới
                    </Button>
                </div>

                {/* Dashboard Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="flex items-center gap-3 p-3">
                            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Users className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-blue-700">{totalLeads}</p>
                                <p className="text-[11px] text-muted-foreground">Tổng Lead</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-amber-50 border-amber-200">
                        <CardContent className="flex items-center gap-3 p-3">
                            <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
                                <DollarSign className="w-4 h-4 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-amber-700">{depositCount}</p>
                                <p className="text-[11px] text-muted-foreground">Đặt cọc</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-indigo-50 border-indigo-200">
                        <CardContent className="flex items-center gap-3 p-3">
                            <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center">
                                <FileCheck className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-indigo-700">{enrollmentCount}</p>
                                <p className="text-[11px] text-muted-foreground">Nhập học</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-emerald-50 border-emerald-200">
                        <CardContent className="flex items-center gap-3 p-3">
                            <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-emerald-700">{departedCount}</p>
                                <p className="text-[11px] text-muted-foreground">Xuất cảnh</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Pipeline Mini Chart */}
                <Card>
                    <CardContent className="p-3">
                        <div className="flex items-center gap-1 h-7 rounded-lg overflow-hidden">
                            {STATUS_ORDER.map((status) => {
                                const count = leads.filter(l => l.status === status).length;
                                if (count === 0) return null;
                                const pct = (count / totalLeads) * 100;
                                const cfg = STATUS_CONFIG[status];
                                return (
                                    <div
                                        key={status}
                                        className={cn("h-full flex items-center justify-center text-[10px] font-bold transition-all", cfg.bg, cfg.color)}
                                        style={{ width: `${pct}%`, minWidth: count > 0 ? "30px" : "0" }}
                                        title={`${cfg.label}: ${count}`}
                                    >
                                        {count}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex flex-wrap gap-3 mt-2">
                            {STATUS_ORDER.map((status) => {
                                const count = leads.filter(l => l.status === status).length;
                                const cfg = STATUS_CONFIG[status];
                                return (
                                    <div key={status} className="flex items-center gap-1 text-[10px]">
                                        <div className={cn("w-2 h-2 rounded-full", cfg.bg, "border", cfg.border)} />
                                        <span className="text-muted-foreground">{cfg.label}: <b className={cfg.color}>{count}</b></span>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Filters & View Toggle */}
                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative flex-1 min-w-[200px] max-w-sm">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Tìm kiếm tên, SĐT..."
                            className="pl-8 h-8 text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select value={filterSource} onValueChange={setFilterSource}>
                        <SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue placeholder="Nguồn" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả nguồn</SelectItem>
                            {Object.entries(SOURCE_CONFIG).map(([key, cfg]) => (
                                <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue placeholder="Loại" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả loại</SelectItem>
                            {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                                <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue placeholder="Trạng thái" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả TT</SelectItem>
                            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                                <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={filterSale} onValueChange={setFilterSale}>
                        <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue placeholder="Sale" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả Sale</SelectItem>
                            {SALESPEOPLE.map(s => (
                                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="ml-auto flex items-center gap-1 border rounded-lg p-0.5">
                        <Button
                            size="sm"
                            variant={view === "kanban" ? "default" : "ghost"}
                            className="h-7 px-2 text-xs"
                            onClick={() => setView("kanban")}
                        >
                            <LayoutGrid className="w-3.5 h-3.5 mr-1" />
                            Kanban
                        </Button>
                        <Button
                            size="sm"
                            variant={view === "table" ? "default" : "ghost"}
                            className="h-7 px-2 text-xs"
                            onClick={() => setView("table")}
                        >
                            <List className="w-3.5 h-3.5 mr-1" />
                            Bảng
                        </Button>
                    </div>
                </div>

                {/* Kanban View */}
                {view === "kanban" && (
                    <div className="flex gap-3 overflow-x-auto pb-4">
                        {STATUS_ORDER.map((status) => {
                            const cfg = STATUS_CONFIG[status];
                            const columnLeads = kanbanData[status];
                            const isDragOver = dragOverStatus === status;
                            return (
                                <div key={status} className="flex-shrink-0 w-[220px]">
                                    <div className={cn("flex items-center gap-2 px-3 py-2 rounded-t-lg border-b-2", cfg.bg, cfg.border)}>
                                        <span className={cn("text-xs font-bold", cfg.color)}>{cfg.label}</span>
                                        <Badge variant="outline" className="text-[10px] h-5 px-1.5">{columnLeads.length}</Badge>
                                    </div>
                                    <div
                                        className={cn(
                                            "space-y-2 p-2 rounded-b-lg min-h-[200px] border border-t-0 transition-all duration-200",
                                            isDragOver
                                                ? cn("ring-2 ring-offset-1", cfg.bg, `ring-current ${cfg.color}`)
                                                : "bg-muted/30"
                                        )}
                                        onDragOver={(e) => handleDragOver(e, status)}
                                        onDragLeave={handleDragLeave}
                                        onDrop={(e) => handleDrop(e, status)}
                                    >
                                        {columnLeads.map((lead) => (
                                            <LeadCard key={lead.id} lead={lead} onClick={() => handleLeadClick(lead)} onDragStart={handleDragStart} onMoveNext={handleMoveNext} />
                                        ))}
                                        {columnLeads.length === 0 && (
                                            <p className={cn("text-center text-xs py-8", isDragOver ? cn(cfg.color, "font-semibold") : "text-muted-foreground")}>
                                                {isDragOver ? "Thả vào đây" : "Không có lead"}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Table View */}
                {view === "table" && (
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/30">
                                            <th className="text-left p-3 font-semibold text-xs">Tên</th>
                                            <th className="text-left p-3 font-semibold text-xs">SĐT</th>
                                            <th className="text-left p-3 font-semibold text-xs">Loại</th>
                                            <th className="text-left p-3 font-semibold text-xs">Nguồn</th>
                                            <th className="text-left p-3 font-semibold text-xs">Trạng thái</th>
                                            <th className="text-left p-3 font-semibold text-xs">Tiếng Nhật</th>
                                            <th className="text-left p-3 font-semibold text-xs">Đã thu</th>
                                            <th className="text-center p-3 font-semibold text-xs">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredLeads.map((lead) => {
                                            const cat = CATEGORY_CONFIG[lead.category];
                                            const sts = STATUS_CONFIG[lead.status];
                                            const src = SOURCE_CONFIG[lead.source];
                                            const SrcIcon = src.icon;
                                            return (
                                                <tr key={lead.id} className="border-b hover:bg-muted/20 cursor-pointer transition-colors" onClick={() => handleLeadClick(lead)}>
                                                    <td className="p-3">
                                                        <p className="font-medium text-sm">{lead.name}</p>
                                                        <p className="text-[11px] text-muted-foreground">{lead.email}</p>
                                                    </td>
                                                    <td className="p-3 text-sm">{lead.phone}</td>
                                                    <td className="p-3">
                                                        <Badge className={cn("text-[10px] px-1.5 border", cat.bg, cat.color, cat.border)}>{cat.label}</Badge>
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex items-center gap-1.5">
                                                            <SrcIcon className={cn("w-3.5 h-3.5", src.color)} />
                                                            <span className="text-xs">{src.label}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-3">
                                                        <Badge className={cn("text-[10px] px-1.5 border", sts.bg, sts.color, sts.border)}>{sts.label}</Badge>
                                                    </td>
                                                    <td className="p-3 text-xs">{lead.japaneseLevel}</td>
                                                    <td className="p-3 text-xs font-medium">{lead.financials.paid > 0 ? formatCurrency(lead.financials.paid) : "-"}</td>
                                                    <td className="p-3 text-center">
                                                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs gap-1">
                                                            Xem <ChevronRight className="w-3 h-3" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Lead Detail Dialog */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                <Users className="w-5 h-5 text-primary" />
                                Chi tiết Lead
                            </DialogTitle>
                        </DialogHeader>
                        {selectedLead && (() => {
                            const lead = selectedLead;
                            const cat = CATEGORY_CONFIG[lead.category];
                            const sts = STATUS_CONFIG[lead.status];
                            const src = SOURCE_CONFIG[lead.source];
                            const SrcIcon = src.icon;
                            const totalFee = lead.financials.deposit + lead.financials.processingFee + lead.financials.finalPayment;
                            return (
                                <div className="space-y-5 pt-2">
                                    {/* Quick Actions */}
                                    <div className="flex flex-wrap gap-2">
                                        <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8" onClick={() => window.open(`tel:${lead.phone}`)}>
                                            <Phone className="w-3.5 h-3.5" /> Gọi điện
                                        </Button>
                                        <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8" onClick={() => { setStatusChangeOpen(true); }}>
                                            <ArrowRightLeft className="w-3.5 h-3.5" /> Chuyển trạng thái
                                        </Button>
                                        <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8" onClick={() => { setNoteDialogOpen(true); setNewNote(""); }}>
                                            <MessageSquarePlus className="w-3.5 h-3.5" /> Thêm ghi chú
                                        </Button>
                                        <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8 border-orange-300 text-orange-700 hover:bg-orange-50" onClick={() => { setOrderDialogOpen(true); setOrderSearch(""); }}>
                                            <Briefcase className="w-3.5 h-3.5" /> Gán đơn hàng
                                        </Button>
                                    </div>

                                    {/* Profile */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        <div>
                                            <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Họ tên</p>
                                            <p className="text-sm font-bold">{lead.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Số điện thoại</p>
                                            <p className="text-sm">{lead.phone}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Email</p>
                                            <p className="text-sm">{lead.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Loại</p>
                                            <Badge className={cn("text-[10px] border", cat.bg, cat.color, cat.border)}>{cat.label}</Badge>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Trạng thái</p>
                                            <Badge className={cn("text-[10px] border", sts.bg, sts.color, sts.border)}>{sts.label}</Badge>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Nguồn</p>
                                            <div className="flex items-center gap-1.5">
                                                <SrcIcon className={cn("w-3.5 h-3.5", src.color)} />
                                                <span className="text-sm">{src.label}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Trình độ</p>
                                            <p className="text-sm">{lead.education}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Tiếng Nhật</p>
                                            <p className="text-sm font-medium">{lead.japaneseLevel}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Ngày tạo</p>
                                            <p className="text-sm">{lead.createdAt}</p>
                                        </div>
                                        {(lead.height || lead.weight) && (
                                            <>
                                                <div>
                                                    <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Chiều cao</p>
                                                    <p className="text-sm">{lead.height ? `${lead.height} cm` : "-"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Cân nặng</p>
                                                    <p className="text-sm">{lead.weight ? `${lead.weight} kg` : "-"}</p>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Salesperson Info */}
                                    {(() => {
                                        const sale = SALESPEOPLE.find(s => s.id === lead.saleId);
                                        if (!sale) return null;
                                        return (
                                            <div className="p-3 rounded-lg border bg-sky-50/50 border-sky-200">
                                                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2 flex items-center gap-1.5">
                                                    <UserCog className="w-3.5 h-3.5" /> Sale phụ trách
                                                </p>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-sky-200 flex items-center justify-center text-sky-700 font-bold text-sm">
                                                        {sale.avatar}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold">{sale.name}</p>
                                                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                                                            <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{sale.phone}</span>
                                                            <span>{sale.email}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {/* Notes */}
                                    {lead.notes && (
                                        <div className="p-3 bg-muted/30 rounded-lg border">
                                            <div className="flex items-center gap-1.5 mb-1.5">
                                                <StickyNote className="w-3.5 h-3.5 text-muted-foreground" />
                                                <p className="text-[10px] font-semibold text-muted-foreground uppercase">Ghi chú</p>
                                            </div>
                                            <p className="text-sm text-foreground/80 italic">{lead.notes}</p>
                                        </div>
                                    )}

                                    {/* Document Tracking */}
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-2 flex items-center gap-1.5">
                                            <FileCheck className="w-3.5 h-3.5" /> Hồ sơ giấy tờ
                                        </p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                            {[
                                                { key: "passport", label: "Hộ chiếu" },
                                                { key: "coe", label: "COE" },
                                                { key: "visa", label: "Visa" },
                                                { key: "healthCert", label: "Khám SK" },
                                            ].map((doc) => {
                                                const done = lead.documents[doc.key as keyof LeadDocument];
                                                return (
                                                    <div
                                                        key={doc.key}
                                                        className={cn(
                                                            "flex items-center gap-2 p-2 rounded-lg border text-xs",
                                                            done ? "bg-emerald-50 border-emerald-200" : "bg-muted/30 border-border"
                                                        )}
                                                    >
                                                        {done ? (
                                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                        ) : (
                                                            <Circle className="w-4 h-4 text-muted-foreground" />
                                                        )}
                                                        <span className={done ? "text-emerald-700 font-medium" : "text-muted-foreground"}>{doc.label}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Assigned Job Order */}
                                    {lead.assignedOrderId && (() => {
                                        const order = JOB_ORDERS.find(o => o.id === lead.assignedOrderId);
                                        if (!order) return null;
                                        return (
                                            <div>
                                                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2 flex items-center gap-1.5">
                                                    <Briefcase className="w-3.5 h-3.5" /> Đơn hàng đã gán
                                                </p>
                                                <div className="p-3 rounded-lg border-2 border-orange-200 bg-orange-50/50 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <Badge className="bg-orange-100 text-orange-700 border border-orange-300 text-[10px]">{order.code}</Badge>
                                                            <span className="font-bold text-sm">{order.jobTitle}</span>
                                                        </div>
                                                        <Button size="sm" variant="ghost" className="h-6 px-2 text-[10px] text-rose-500 hover:text-rose-700" onClick={handleRemoveOrder}>
                                                            Gỡ
                                                        </Button>
                                                    </div>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                                                        <div className="flex items-center gap-1.5">
                                                            <Building2 className="w-3 h-3 text-muted-foreground" />
                                                            <span>{order.companyName}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <MapPin className="w-3 h-3 text-muted-foreground" />
                                                            <span>{order.location}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <DollarSign className="w-3 h-3 text-muted-foreground" />
                                                            <span>{order.salary}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Users className="w-3 h-3 text-muted-foreground" />
                                                            <span>{order.filled}/{order.quantity} người</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {!lead.assignedOrderId && (
                                        <div className="p-3 rounded-lg border border-dashed border-orange-300 bg-orange-50/30 flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-sm text-orange-600">
                                                <Briefcase className="w-4 h-4" />
                                                <span>Chưa gán đơn hàng</span>
                                            </div>
                                            <Button size="sm" variant="outline" className="h-7 text-xs gap-1 border-orange-300 text-orange-700 hover:bg-orange-50" onClick={() => { setOrderDialogOpen(true); setOrderSearch(""); }}>
                                                <Briefcase className="w-3 h-3" /> Gán ngay
                                            </Button>
                                        </div>
                                    )}

                                    {/* Financials */}
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-2 flex items-center gap-1.5">
                                            <DollarSign className="w-3.5 h-3.5" /> Tài chính
                                        </p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                            <div className="p-2 rounded-lg border bg-blue-50 border-blue-200">
                                                <p className="text-[10px] text-muted-foreground">Đặt cọc</p>
                                                <p className="text-sm font-bold text-blue-700">{lead.financials.deposit > 0 ? formatCurrency(lead.financials.deposit) : "-"}</p>
                                            </div>
                                            <div className="p-2 rounded-lg border bg-violet-50 border-violet-200">
                                                <p className="text-[10px] text-muted-foreground">Phí xử lý</p>
                                                <p className="text-sm font-bold text-violet-700">{lead.financials.processingFee > 0 ? formatCurrency(lead.financials.processingFee) : "-"}</p>
                                            </div>
                                            <div className="p-2 rounded-lg border bg-amber-50 border-amber-200">
                                                <p className="text-[10px] text-muted-foreground">Tổng phí</p>
                                                <p className="text-sm font-bold text-amber-700">{totalFee > 0 ? formatCurrency(totalFee) : "-"}</p>
                                            </div>
                                            <div className="p-2 rounded-lg border bg-emerald-50 border-emerald-200">
                                                <p className="text-[10px] text-muted-foreground">Đã thu</p>
                                                <p className="text-sm font-bold text-emerald-700">{lead.financials.paid > 0 ? formatCurrency(lead.financials.paid) : "-"}</p>
                                            </div>
                                        </div>
                                        {totalFee > 0 && (
                                            <div className="mt-2">
                                                <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                                                    <span>Tiến độ thanh toán</span>
                                                    <span>{((lead.financials.paid / totalFee) * 100).toFixed(0)}%</span>
                                                </div>
                                                <div className="h-2 rounded-full bg-muted overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full bg-emerald-500 transition-all"
                                                        style={{ width: `${Math.min((lead.financials.paid / totalFee) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })()}
                    </DialogContent>
                </Dialog>

                {/* Status Change Dialog */}
                <Dialog open={statusChangeOpen} onOpenChange={setStatusChangeOpen}>
                    <DialogContent className="max-w-sm">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold">Chuyển trạng thái</DialogTitle>
                        </DialogHeader>
                        {selectedLead && (
                            <div className="space-y-2 pt-2">
                                <p className="text-sm text-muted-foreground">Chọn trạng thái mới cho <b>{selectedLead.name}</b>:</p>
                                <div className="space-y-1.5">
                                    {STATUS_ORDER.map((status) => {
                                        const cfg = STATUS_CONFIG[status];
                                        const isCurrent = selectedLead.status === status;
                                        return (
                                            <button
                                                key={status}
                                                disabled={isCurrent}
                                                onClick={() => setStatusChangeOpen(false)}
                                                className={cn(
                                                    "w-full flex items-center gap-2 px-3 py-2 rounded-lg border text-sm text-left transition-colors",
                                                    isCurrent ? "opacity-50 cursor-not-allowed bg-muted" : "hover:bg-muted/50 cursor-pointer",
                                                    cfg.border
                                                )}
                                            >
                                                <div className={cn("w-3 h-3 rounded-full", cfg.bg, "border", cfg.border)} />
                                                <span className={cn("font-medium", cfg.color)}>{cfg.label}</span>
                                                {isCurrent && <span className="text-[10px] text-muted-foreground ml-auto">(hiện tại)</span>}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Add Note Dialog */}
                <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
                    <DialogContent className="max-w-sm">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold">Thêm ghi chú</DialogTitle>
                        </DialogHeader>
                        {selectedLead && (
                            <div className="space-y-3 pt-2">
                                <p className="text-sm text-muted-foreground">Ghi chú cho <b>{selectedLead.name}</b>:</p>
                                <Textarea
                                    placeholder="Nhập ghi chú..."
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    rows={4}
                                />
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" size="sm" onClick={() => setNoteDialogOpen(false)}>Hủy</Button>
                                    <Button size="sm" onClick={() => setNoteDialogOpen(false)}>Lưu ghi chú</Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Job Order Assignment Dialog */}
                <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-orange-600" />
                                Gán đơn hàng cho {selectedLead?.name}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3 pt-2">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input placeholder="Tìm theo mã, tên công ty, ngành nghề..." className="pl-8 h-9" value={orderSearch} onChange={e => setOrderSearch(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                {JOB_ORDERS
                                    .filter(o => o.status === "open")
                                    .filter(o => {
                                        if (!orderSearch) return true;
                                        const q = orderSearch.toLowerCase();
                                        return o.code.toLowerCase().includes(q) || o.companyName.toLowerCase().includes(q) || o.jobTitle.toLowerCase().includes(q) || o.industry.toLowerCase().includes(q) || o.location.toLowerCase().includes(q);
                                    })
                                    .map(order => {
                                        const isAssigned = selectedLead?.assignedOrderId === order.id;
                                        return (
                                            <div key={order.id} className={cn(
                                                "p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md",
                                                isAssigned ? "border-orange-400 bg-orange-50" : "border-border hover:border-orange-300"
                                            )} onClick={() => handleAssignOrder(order.id)}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <Badge className="bg-orange-100 text-orange-700 border border-orange-300 text-[10px]">{order.code}</Badge>
                                                        <span className="font-bold text-sm">{order.jobTitle}</span>
                                                        <Badge variant="outline" className="text-[10px]">{order.industry}</Badge>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {isAssigned && <BadgeCheck className="w-5 h-5 text-orange-600" />}
                                                        <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-300 text-[10px]">
                                                            Còn {order.quantity - order.filled} chỗ
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-4 gap-2 text-[11px] text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Building2 className="w-3 h-3" /> {order.companyName}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" /> {order.location}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <DollarSign className="w-3 h-3" /> {order.salary}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Users className="w-3 h-3" /> {order.filled}/{order.quantity}
                                                    </div>
                                                </div>
                                                <p className="text-[10px] text-muted-foreground mt-1.5 italic">Yêu cầu: {order.requirements}</p>
                                            </div>
                                        );
                                    })}
                                {JOB_ORDERS.filter(o => o.status === "open").length === 0 && (
                                    <p className="text-center text-sm text-muted-foreground py-6">Không có đơn hàng nào đang mở</p>
                                )}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Add New Lead Dialog */}
                <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold flex items-center gap-2">
                                <UserPlus className="w-5 h-5 text-primary" />
                                Thêm Lead mới
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3 pt-2">
                            {/* Row 1: Name + Phone + Email */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold">Họ tên <span className="text-rose-500">*</span></Label>
                                    <Input placeholder="Nguyễn Văn A" value={form.name} onChange={e => updateForm("name", e.target.value)} className="h-9" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold">Số điện thoại <span className="text-rose-500">*</span></Label>
                                    <Input placeholder="0912345678" value={form.phone} onChange={e => updateForm("phone", e.target.value)} className="h-9" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold">Email</Label>
                                    <Input placeholder="email@example.com" value={form.email} onChange={e => updateForm("email", e.target.value)} className="h-9" />
                                </div>
                            </div>
                            {/* Row 2: Source + Category + Japanese Level */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold">Nguồn</Label>
                                    <Select value={form.source} onValueChange={v => updateForm("source", v)}>
                                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(SOURCE_CONFIG).map(([key, cfg]) => (
                                                <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold">Loại ứng viên</Label>
                                    <Select value={form.category} onValueChange={v => updateForm("category", v)}>
                                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                                                <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold">Trình độ tiếng Nhật</Label>
                                    <Select value={form.japaneseLevel} onValueChange={v => updateForm("japaneseLevel", v)}>
                                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Chưa có">Chưa có</SelectItem>
                                            <SelectItem value="N5">N5</SelectItem>
                                            <SelectItem value="N4">N4</SelectItem>
                                            <SelectItem value="N3">N3</SelectItem>
                                            <SelectItem value="N2">N2</SelectItem>
                                            <SelectItem value="N1">N1</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            {/* Row 3: Education + Height + Weight */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold">Trình độ học vấn</Label>
                                    <Input placeholder="THPT / Đại học / Cao đẳng..." value={form.education} onChange={e => updateForm("education", e.target.value)} className="h-9" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold">Chiều cao (cm)</Label>
                                    <Input type="number" placeholder="170" value={form.height} onChange={e => updateForm("height", e.target.value)} className="h-9" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold">Cân nặng (kg)</Label>
                                    <Input type="number" placeholder="65" value={form.weight} onChange={e => updateForm("weight", e.target.value)} className="h-9" />
                                </div>
                            </div>
                            {/* Row 4: Notes */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Ghi chú</Label>
                                <Textarea placeholder="Quan tâm đơn hàng gì, mong muốn..." value={form.notes} onChange={e => updateForm("notes", e.target.value)} rows={2} />
                            </div>
                            {/* Actions */}
                            <div className="flex justify-end gap-2 pt-2 border-t">
                                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Hủy</Button>
                                <Button className="gap-1.5" onClick={handleAddLead}>
                                    <UserPlus className="w-4 h-4" /> Thêm Lead
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
};

export default LeadManagement;
