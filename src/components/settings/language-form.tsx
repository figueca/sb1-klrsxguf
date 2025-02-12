import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const languages = [
  {
    code: "pt",
    name: "Português",
    flag: "🇧🇷",
    description: "Português do Brasil"
  },
  {
    code: "en",
    name: "English",
    flag: "🇺🇸",
    description: "American English"
  }
];

export function LanguageForm() {
  const [locale, setLocale] = useState("pt");

  return (
    <div className="space-y-4">
      <RadioGroup
        defaultValue={locale}
        onValueChange={setLocale}
        className="grid gap-4"
      >
        {languages.map((language) => (
          <div key={language.code}>
            <RadioGroupItem
              value={language.code}
              id={language.code}
              className="peer sr-only"
            />
            <Label
              htmlFor={language.code}
              className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{language.flag}</span>
                <div>
                  <p className="text-sm font-medium leading-none">{language.name}</p>
                  <p className="text-sm text-muted-foreground">{language.description}</p>
                </div>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}