import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export function ContactInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información de Contacto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900">Dirección Fiscal </h4>
            <p className="text-gray-600">
              C/Mayor, 27
              <br />
              30149 El Siscar, Murcia, España
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900">Dirección Fábrica </h4>
            <p className="text-gray-600">
              Carretera Nacional N-340
              <br />
              03311 La Aparecida, Alicante, España
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Phone className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900">Teléfono</h4>
            <p className="text-gray-600">966 74 44 73</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Mail className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900">Email</h4>
            <p className="text-gray-600">mysair@mysair.es</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900">Horario de Atención y Almacén </h4>
            <p className="text-gray-600">
              Lunes a Viernes: 6:30 - 15:00
              <br />
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
