"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"

export function ContactInfo() {
  const { t } = useI18n()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("contact.info.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900">{t("contact.info.address_fiscal")}</h4>
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
            <h4 className="font-semibold text-gray-900">{t("contact.info.address_factory")}</h4>
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
            <h4 className="font-semibold text-gray-900">{t("contact.info.phone_title")}</h4>
            <p className="text-gray-600">966 74 44 73</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Mail className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900">{t("contact.info.email_title")}</h4>
            <p className="text-gray-600">mysair@mysair.es</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900">{t("contact.info.hours_title")}</h4>
            <p className="text-gray-600">
              {t("contact.info.hours_desc")}
              <br />
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
