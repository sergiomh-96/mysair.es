import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ContactMap() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nuestra Ubicación</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6280.995483822133!2d-0.9995499048275784!3d38.08207653323977!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd639bc1fea55883%3A0xb4e96b6be4160539!2sMYS%20I%20Materiales%20y%20Soportes%20Industriales%20del%20Levante%20S.L.U.!5e0!3m2!1ses!2ses!4v1758060306115!5m2!1ses!2ses"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación de MYSAir"
          />
        </div>
      </CardContent>
    </Card>
  )
}
