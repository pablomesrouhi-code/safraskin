export default function ContactPage() {
  return (
    <div className="max-w-container mx-auto px-4 py-12">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">تواصل معنا</h1>
        <div className="bg-white rounded-2xl border border-border p-8 space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">البريد الإلكتروني</h3>
            <a href="mailto:support@namabeauty.shop" className="text-sage hover:underline">
              support@namabeauty.shop
            </a>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">ساعات العمل</h3>
            <p className="text-gray-600">الأحد – الخميس · 9 ص – 6 م (توقيت الرياض)</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">واتساب</h3>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "966500000000"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sage hover:underline"
            >
              تواصلي معنا عبر واتساب
            </a>
          </div>
          <form className="space-y-4 pt-4 border-t border-border">
            <div>
              <label className="block text-sm font-medium mb-1.5">الاسم</label>
              <input className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-sage" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">رقم الجوال</label>
              <input className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-sage" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">رسالتك</label>
              <textarea rows={4} className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-sage resize-none" />
            </div>
            <button type="button" className="w-full bg-sage hover:bg-sage-dark text-white font-semibold py-3 rounded-xl transition-colors">
              إرسال
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
