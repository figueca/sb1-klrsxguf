import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppearanceForm } from "@/components/settings/appearance-form";
import { LanguageForm } from "@/components/settings/language-form";

export function ConfiguracoesPage() {
  return (
    <>
      <DashboardHeader
        heading="Configurações"
        text="Preferências do sistema"
      />
      <div className="space-y-6">
        <Tabs defaultValue="appearance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="appearance">Aparência</TabsTrigger>
            <TabsTrigger value="language">Idioma</TabsTrigger>
          </TabsList>
          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Aparência</CardTitle>
                <CardDescription>
                  Personalize a aparência do sistema e escolha entre os temas disponíveis.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <AppearanceForm />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="language" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Idioma</CardTitle>
                <CardDescription>
                  Escolha o idioma de sua preferência para a interface do sistema.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <LanguageForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}