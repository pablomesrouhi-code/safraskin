export const metadata = { title: "تواصل | سفراسكين" };

export default function ContactPage() {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  return (
    <article className="mx-auto max-w-2xl px-4 py-14 leading-8 text-muted">
      <h1 className="text-3xl font-bold text-ink">تواصلي معنا</h1>
      <p className="mt-6">
        للطلبات: الاسم والتيليفون فالسلة كافيين. غنعيّطو ليكِ لتأكيد العنوان.
      </p>
      <p className="mt-4">
        للأسئلة بعد الطلب، خلي التيليفون اللي طلبتي بيه قريب — نفس الرقم اللي كنعيّطو عليه.
      </p>
      {wa ? (
        <a
          href={`https://wa.me/${wa.replace(/\D/g, "")}`}
          className="mt-8 inline-block rounded-xl bg-rose px-5 py-3 font-bold text-white"
        >
          واتساب
        </a>
      ) : (
        <p className="mt-8 text-sm">رقم الواتساب غادي يتزاد هنا من إعدادات الموقع.</p>
      )}
    </article>
  );
}
