import { redirect } from "next/navigation";

export const metadata = {
  title: "مجموعة ليالي بيوتي | عروض فاخرة بالدفع عند الاستلام",
};

export default function CollectionsPage() {
  redirect("/products/aroma-flame-lamp");
}
