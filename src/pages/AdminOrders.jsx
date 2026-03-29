import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Eye,
  Search,
  Calendar,
  Users,
  Phone,
  MessageSquare,
  FileText
} from "lucide-react";

const statusColors = {
  "חדש": "bg-blue-100 text-blue-800 border-blue-200",
  "בטיפול": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "ממתין לאישור": "bg-purple-100 text-purple-800 border-purple-200",
  "מאושר": "bg-green-100 text-green-800 border-green-200",
  "בוטל": "bg-red-100 text-red-800 border-red-200",
  "בוצע": "bg-slate-100 text-slate-800 border-slate-200"
};

const statuses = ["חדש", "בטיפול", "ממתין לאישור", "מאושר", "בוטל", "בוצע"];

export default function AdminOrders() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("הכל");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await base44.auth.me();
      if (!currentUser) {
        window.location.href = "/admin-login";
        return;
      }
      setUser(currentUser);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => base44.entities.Order.list("-created_date"),
    enabled: !!user
  });

  const { data: orderItems = [] } = useQuery({
    queryKey: ['orderItems', selectedOrder?.id],
    queryFn: async () => {
      if (!selectedOrder) return [];
      const items = await base44.entities.OrderItem.filter({ order: selectedOrder.id });
      
      const itemsWithProducts = await Promise.all(
        items.map(async (item) => {
          const product = await base44.entities.Product.get(item.product);
          return {
            ...item,
            product_name: product.name,
            product_image: product.image
          };
        })
      );
      
      return itemsWithProducts;
    },
    enabled: !!selectedOrder
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Order.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    }
  });

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone?.includes(searchTerm);
    const matchesStatus =
      statusFilter === "הכל" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (orderId, newStatus) => {
    updateOrderMutation.mutate({ id: orderId, data: { status: newStatus } });
  };

  const handleInternalNotesUpdate = (orderId, notes) => {
    updateOrderMutation.mutate({ id: orderId, data: { internal_notes: notes } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">טוען...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">ניהול הזמנות</h1>
          <p className="text-slate-600">צפייה ועדכון סטטוס הזמנות</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="חיפוש לפי שם או טלפון..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 h-12 rounded-xl"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 h-12 rounded-xl">
                <SelectValue placeholder="סינון לפי סטטוס" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="הכל">כל הסטטוסים</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "חדשות", status: "חדש", color: "bg-blue-500" },
            { label: "בטיפול", status: "בטיפול", color: "bg-yellow-500" },
            { label: "מאושרות", status: "מאושר", color: "bg-green-500" },
            { label: "סה״כ", status: null, color: "bg-slate-500" }
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className={`w-3 h-3 rounded-full ${stat.color} mb-3`} />
              <p className="text-2xl font-bold text-slate-800">
                {stat.status
                  ? orders.filter((o) => o.status === stat.status).length
                  : orders.length}
              </p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {ordersLoading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">לא נמצאו הזמנות</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="text-right font-semibold">שם הלקוח</TableHead>
                  <TableHead className="text-right font-semibold">תאריך אירוע</TableHead>
                  <TableHead className="text-right font-semibold">מספר אנשים</TableHead>
                  <TableHead className="text-right font-semibold">סטטוס</TableHead>
                  <TableHead className="text-right font-semibold">פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">{order.customer_name}</TableCell>
                    <TableCell>
                      {order.event_date
                        ? format(new Date(order.event_date), "dd/MM/yyyy", { locale: he })
                        : "-"}
                    </TableCell>
                    <TableCell>{order.guests_count || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${statusColors[order.status]} font-medium`}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className="hover:bg-amber-50 hover:text-amber-600"
                      >
                        <Eye className="w-4 h-4 ml-1" />
                        צפייה
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Order Details Sheet */}
      <Sheet open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <SheetContent side="left" className="w-full sm:max-w-lg overflow-y-auto">
          {selectedOrder && (
            <>
              <SheetHeader className="mb-6">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-2xl">פרטי הזמנה</SheetTitle>
                  <Badge
                    variant="outline"
                    className={`${statusColors[selectedOrder.status]} font-medium`}
                  >
                    {selectedOrder.status}
                  </Badge>
                </div>
              </SheetHeader>

              <div className="space-y-6">
                {/* Customer Info */}
                <div className="bg-slate-50 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">שם הלקוח</p>
                      <p className="font-semibold text-slate-800">
                        {selectedOrder.customer_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">
                        {selectedOrder.delivery_method === "משלוח" && selectedOrder.is_gift ? "טלפון המקבל" : "טלפון"}
                      </p>
                      <p className="font-semibold text-slate-800">
                        {selectedOrder.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">תאריך האירוע</p>
                      <p className="font-semibold text-slate-800">
                        {selectedOrder.event_date
                          ? format(new Date(selectedOrder.event_date), "dd/MM/yyyy", {
                              locale: he
                            })
                          : "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">מספר אנשים</p>
                      <p className="font-semibold text-slate-800">
                        {selectedOrder.guests_count || "-"}
                      </p>
                    </div>
                  </div>

                  {selectedOrder.delivery_method && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">שיטת משלוח</p>
                        <p className="font-semibold text-slate-800">
                          {selectedOrder.delivery_method}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedOrder.delivery_method === "משלוח" && selectedOrder.delivery_address && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">כתובת למשלוח</p>
                        <p className="font-semibold text-slate-800 whitespace-pre-line">
                          {selectedOrder.delivery_address}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedOrder.delivery_method === "משלוח" && (
                    <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                      <p className="text-teal-700 text-sm font-medium">
                        💡 דמי משלוח ישוקללו במחיר לאחר שיחה טלפונית.
                      </p>
                    </div>
                  )}

                  {selectedOrder.is_gift && (
                    <div className="bg-amber-50 rounded-xl p-4 space-y-3 border-2 border-amber-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">🎁</span>
                        <span className="font-bold text-amber-700">זו מתנה!</span>
                      </div>
                      
                      {selectedOrder.sender_name && (
                        <div>
                          <p className="text-sm text-slate-500">שולח:</p>
                          <p className="text-slate-800 font-medium">{selectedOrder.sender_name}</p>
                          {selectedOrder.sender_phone && (
                            <p className="text-slate-600 text-sm">{selectedOrder.sender_phone}</p>
                          )}
                        </div>
                      )}
                      
                      {selectedOrder.recipient_name && (
                        <div>
                          <p className="text-sm text-slate-500">מקבל:</p>
                          <p className="text-slate-800 font-medium">{selectedOrder.recipient_name}</p>
                        </div>
                      )}
                      
                      {selectedOrder.gift_message && (
                        <div>
                          <p className="text-sm text-slate-500">ברכה למתנה:</p>
                          <p className="text-slate-700 italic whitespace-pre-line">"{selectedOrder.gift_message}"</p>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedOrder.ready_time && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-teal-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">מתי צריך להיות מוכן</p>
                        <p className="font-semibold text-slate-800">
                          {format(new Date(selectedOrder.ready_time), "dd/MM/yyyy HH:mm", {
                            locale: he
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tray Types */}
                {selectedOrder.tray_types?.length > 0 && (
                  <div>
                    <Label className="text-slate-700 font-medium mb-3 block">
                      סוגי מגשים
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedOrder.tray_types.map((type) => (
                        <Badge key={type} variant="secondary" className="px-3 py-1">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Customer Notes */}
                {selectedOrder.notes && (
                  <div>
                    <Label className="text-slate-700 font-medium mb-3 block">
                      הערות מהלקוח
                    </Label>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-slate-600">{selectedOrder.notes}</p>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                {orderItems.length > 0 && (
                  <div>
                    <Label className="text-slate-700 font-medium mb-3 block">
                      מה הוזמן
                    </Label>
                    <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                      {orderItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg p-3 flex items-center gap-3">
                          {item.product_image && (
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-slate-800">{item.product_name}</p>
                            <p className="text-sm text-slate-600">כמות: {item.quantity}</p>
                            {item.notes && (
                              <p className="text-sm text-slate-500 mt-1">הערות: {item.notes}</p>
                            )}
                          </div>
                          {item.price && (
                            <div className="text-left">
                              <p className="text-sm text-slate-500">₪{item.price} × {item.quantity}</p>
                              <p className="font-bold text-teal-600">₪{item.price * item.quantity}</p>
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {orderItems.some(item => item.price) && (
                        <div className="border-t border-slate-200 pt-3 mt-3">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-slate-800">סה״כ הזמנה:</span>
                            <span className="text-2xl font-bold text-teal-600">
                              ₪{orderItems.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Status Update */}
                <div>
                  <Label className="text-slate-700 font-medium mb-3 block">
                    עדכון סטטוס
                  </Label>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(value) =>
                      handleStatusUpdate(selectedOrder.id, value)
                    }
                  >
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Internal Notes */}
                <div>
                  <Label className="text-slate-700 font-medium mb-3 block">
                    הערות פנימיות (לצוות בלבד)
                  </Label>
                  <Textarea
                    value={selectedOrder.internal_notes || ""}
                    onChange={(e) =>
                      setSelectedOrder({
                        ...selectedOrder,
                        internal_notes: e.target.value
                      })
                    }
                    onBlur={() =>
                      handleInternalNotesUpdate(
                        selectedOrder.id,
                        selectedOrder.internal_notes
                      )
                    }
                    placeholder="הוסף הערות פנימיות..."
                    rows={4}
                    className="rounded-xl resize-none"
                  />
                </div>

                {/* Created Date */}
                <div className="text-sm text-slate-500 pt-4 border-t">
                  <p>
                    נוצר בתאריך:{" "}
                    {format(new Date(selectedOrder.created_date), "dd/MM/yyyy HH:mm", {
                      locale: he
                    })}
                  </p>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}