import type {Metadata} from "next";

import Heading from "@/components/shared/typography/heading";
import {getCustomer} from "@/data/medusa/customer";
import {listRegions} from "@/data/medusa/regions";
import {Separator} from "@merchify/ui";
import {notFound} from "next/navigation";

import ProfileForm from "./_parts/profile-form";

export const metadata: Metadata = {
  description: "View and edit your Medusa Store profile.",
  title: "Profile",
};

export default async function ProfilePage() {
  const customer = await getCustomer();
  const regions = await listRegions();
  if (!customer) {
    notFound();
  }
  return (
    <div className="space-y-6">
      <div>
        <Heading mobileSize="lg" tag="h3">
          الملف الشخصي
        </Heading>
        <p className="text-muted-foreground text-sm">
          تحديث معلومات حسابك الأساسية
        </p>
      </div>
      <Separator />
      <ProfileForm customer={customer} regions={regions} />
    </div>
  );
}
