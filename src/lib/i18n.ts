export type Language = "he" | "en";

export const DEFAULT_LANGUAGE: Language = "he";

export function isLanguage(value: unknown): value is Language {
  return value === "he" || value === "en";
}

export const translations = {
  he: {
    meta: {
      title: "מחקר הריון ותסמונת דאון | אוניברסיטת בר-אילן"
    },
    nav: {
      study: "המחקר",
      why: "למה זה חשוב",
      join: "הצטרפות",
      languageLabel: "בחירת שפה",
      primaryLabel: "ניווט ראשי"
    },
    brand: {
      title: "המעבדה לחקר מחלת האלצהיימר על שם פול פדר באוניברסיטת בר-אילן",
      subtitle: "גיוס משתתפות למחקר"
    },
    hero: {
      eyebrow: "מחקר באוניברסיטת בר-אילן",
      title: "כל אמא נושאת איתה סיפור.\nחלק מהסיפורים יכולים לשנות את המדע.",
      subtitle: [
        "במהלך ההריון נוצרת מערכת יחסים ביולוגית ייחודית בין האם לעובר.",
        "במעבדתו של פרופ' איתן אוקון באוניברסיטת בר-אילן אנו חוקרים האם חומרים ביולוגיים העוברים מהעובר לאם במהלך ההריון עשויים להשפיע על בריאות המוח שנים רבות לאחר מכן.",
        "אם את אם לילד או ילדה עם תסמונת דאון, נשמח להזמין אותך לקחת חלק במחקר שעשוי לסייע בהבנת הקשר בין הריון, תסמונת דאון ומחלת האלצהיימר."
      ],
      impact:
        "תרומת דם אחת יכולה לעזור לנו להתקרב לתשובות על שאלות שעדיין אינן פתורות.",
      primaryCta: "הצטרפי למחקר",
      secondaryCta: "למה המחקר חשוב?"
    },
    video: {
      title: "הזמנה אישית מפרופ' איתן אוקון",
      subtitle: "למה המחקר הזה חשוב, ואיך ההשתתפות שלך יכולה לסייע לקידום המחקר.",
      placeholderTitle: "מקום שמור לסרטון הזמנה אישי",
      placeholderHeading: "כאן יופיע סרטון ההזמנה",
      placeholderText:
        "כאשר הסרטון יהיה מוכן, הוא יוצג כאן ישירות באתר ללא מעבר ליוטיוב.",
      playLabel: "הפעלת סרטון ההזמנה",
      unsupported: "הדפדפן שלך אינו תומך בהצגת וידאו."
    },
    research: {
      eyebrow: "למה המחקר חשוב",
      title: "מדוע אנו חוקרים אימהות לילדים עם תסמונת דאון?",
      intro: [
        "הריון כרוך בקשר ביולוגי יוצא דופן בין אם לילד. במהלך ההריון, תאים, חלבונים, DNA וחומרים ביולוגיים אחרים יכולים לעבור בין העובר לאם. חוקרים גילו שחלק מתאים עובריים אלו ניתנים לזיהוי בגוף האם במשך שנים רבות.",
        "מספר מחקרים הבחינו בהבדלים בבריאות המוח לטווח ארוך בקרב אימהות לילדים עם תסמונת דאון, אך הגורמים הביולוגיים העומדים בבסיס ממצאים אלה עדיין אינם מובנים היטב. אנו מעוניינים גם להבין האם תהליכים ביולוגיים אלה עשויים להיות רלוונטיים למצבים הקשורים להזדקנות המוח, כולל מחלת האלצהיימר.",
        "מחקרנו שואף לבחון האם אותות ביולוגיים המוחלפים במהלך ההריון עשויים לתרום לבריאות האם לטווח ארוך. על ידי לימוד תהליכים אלה, אנו מקווים לקדם את ההבנה המדעית של הריון, הזדקנות ובריאות המוח, ולתמוך במחקר עתידי בתחום זה.",
        "אם את אם לילד עם תסמונת דאון, השתתפותך עשויה לסייע בקידום המחקר בנושא הריון, בריאות האם ובריאות המוח לטווח ארוך."
      ],
      cards: [
        {
          title: "נשים ובריאות המוח",
          text: "הבנת הגורמים המשפיעים על בריאות המוח של נשים לאורך החיים היא תחום חשוב במחקר הרפואי."
        },
        {
          title: "תסמונת דאון ובריאות האם",
          text: "מחקרים קודמים זיהו הבדלים בבריאות המוח לטווח ארוך בקרב אימהות לילדים עם תסמונת דאון, מה שהדגיש שאלות חשובות למחקר נוסף."
        },
        {
          title: "קשר בין אם לעובר",
          text: "במהלך ההריון, תאים וחומרים ביולוגיים יכולים לעבור מהעובר לגוף האם."
        },
        {
          title: "המחקר שלנו",
          text: "ממצאים ראשוניים מצביעים על כך שחומרים ביולוגיים המוחלפים במהלך ההריון עשויים להישאר ניתנים לגילוי אצל אימהות במשך שנים רבות."
        },
        {
          title: "מה אנו חוקרים",
          text: "האם תהליכים אלה עשויים להיות קשורים לבריאות המוח של האם לאורך כל החיים."
        }
      ],
      closing:
        "השתתפותך יכולה לעזור לחוקרים להבין טוב יותר כיצד הריון עשוי להשפיע על בריאות האם ובריאות המוח לאורך כל החיים."
    },
    participation: {
      eyebrow: "השתתפות והרשמה",
      title: "מי יכולה להשתתף?",
      eligibility: [
        "אם לילד עם תסמונת דאון",
        "גיל 18 ומעלה",
        "נכונות לתרום דגימת דם"
      ],
      involvementTitle: "מה כרוכה בהשתתפות?",
      involvement: [
        "תרומת דם אחת",
        "שאלון קצר",
        "כ-15-30 דקות מזמנך",
        "יצירת קשר עתידית אופציונלית בנוגע למחקרים קשורים"
      ],
      whyTitle: "למה להשתתף?",
      whyIntro: "ההשתתפות שלך יכולה לעזור לנו:",
      reasons: [
        "להבין טוב יותר את ההשפעות הביולוגיות ארוכות הטווח של ההריון",
        "לזהות סמנים ביולוגיים שעשויים להיות קשורים לסיכון למחלת אלצהיימר",
        "לקדם מחקר שעשוי בעתיד לסייע בזיהוי מוקדם יותר של המחלה",
        "להרחיב את הידע על בריאות נשים לאורך החיים"
      ],
      final:
        "כל תרומת דם מייצגת סיפור אישי, ומסייעת לנו להתקרב להבנת שאלות שעדיין אינן פתורות."
    },
    form: {
      eyebrow: "טופס הרשמה",
      title: "נשמח לדעת באם את מעוניינת לקבל מידע נוסף או להצטרף למחקר",
      description:
        "תודה ששקלת להשתתף. לאחר שתגישי טופס זה, צוות המחקר עשוי ליצור איתך קשר כדי לדון בזכאות ובקביעת מועד. רישום אינו מבטיח זכאות.",
      eligibilityTitle: "מי יכולה להשתתף?",
      eligibility: [
        "אם לילד עם תסמונת דאון",
        "גיל 18 ומעלה",
        "נכונות לתרום דגימת דם"
      ],
      involvementTitle: "מה כרוכה בהשתתפות?",
      involvement: [
        "תרומת דם אחת",
        "שאלון קצר",
        "כ-15-30 דקות מזמנך",
        "יצירת קשר עתידית אופציונלית בנוגע למחקרים קשורים"
      ],
      fields: {
        fullName: "שם מלא",
        email: "אימייל",
        phone: "מספר טלפון",
        city: "עיר",
        ageRange: "טווח גיל",
        childAgeRange: "טווח גיל הילד/ה",
        preferredContact: "דרך מועדפת ליצירת קשר",
        comments: "הערות נוספות"
      },
      placeholders: {
        select: "בחרי אפשרות",
        comments: "אפשר לציין העדפות תיאום, שאלות או מידע שחשוב לך לשתף."
      },
      contactMethods: {
        Email: "אימייל",
        Phone: "טלפון",
        Either: "אין העדפה"
      },
      consentTitle: "אני מסכימה שצוות המחקר יצור איתי קשר בנוגע למחקר זה.",
      consentHelper: "הסכמה זו מאפשרת לצוות לפנות אלייך לגבי התאמה, תיאום והמשך התהליך.",
      submit: "שליחת הרשמה",
      submitting: "שולחת...",
      duplicate:
        "הטופס כבר נשלח עם אותם פרטים. אנא המתיני לפני שליחה חוזרת של אותם נתונים.",
      consentRequired: "אנא אשרי יצירת קשר כדי שצוות המחקר יוכל לפנות אלייך בנוגע למחקר.",
      genericError: "משהו השתבש בשליחת הטופס. אנא נסי שוב בעוד רגע.",
      successFallback:
        "תודה שפנית אלינו. קיבלנו את התעניינותך, והודעת אישור נשלחה אלייך. אם המחקר עשוי להתאים, צוות המחקר עשוי ליצור איתך קשר בהמשך עם פרטים נוספים.",
    },
    footer: {
      credit: "בתודה לאימהות ולמשפחות שמאפשרות מחקר מדעי משמעותי."
    },
    api: {
      invalidBody: "הבקשה אינה תקינה. אנא שלחי את הטופס שוב.",
      missingConfig: "מערכת ההרשמה עדיין אינה מוגדרת במלואה. אנא פני למנהל האתר.",
      unreachable: "שירות ההרשמה אינו זמין כרגע. אנא נסי שוב בעוד כמה דקות.",
      defaultSuccess:
        "תודה שפנית אלינו. קיבלנו את התעניינותך, והודעת אישור נשלחה אלייך. אם המחקר עשוי להתאים, צוות המחקר עשוי ליצור איתך קשר בהמשך עם פרטים נוספים.",
      errors: {
        sheet_write_failed: "לא הצלחנו לשמור את ההרשמה במערכת המחקר.",
        sheet_unavailable: "מערכת ההרשמה אינה זמינה כרגע. אנא נסי שוב בקרוב.",
        validation_error: "חלק מהפרטים בטופס דורשים תיקון. אנא בדקי ושלחי שוב.",
        email_failed: "לא ניתן היה להשלים את ההרשמה עקב בעיה בשליחת אימייל.",
        unauthorized: "אירעה בעיית אימות בשירות ההרשמה. אנא פני למנהל האתר.",
        misconfigured: "שירות ההרשמה אינו מוגדר במלואו. אנא פני למנהל האתר.",
        apps_script_access_denied:
          "שירות ההרשמה מחובר, אך אין לו הרשאת גישה לפריסת Google Apps Script. אנא פני למנהל האתר.",
        default: "לא ניתן לשלוח את ההרשמה כרגע. אנא נסי שוב בעוד רגע."
      }
    },
    validation: {
      invalidPayload: "פרטי ההרשמה אינם תקינים.",
      fullName: "יש להזין שם מלא.",
      email: "יש להזין כתובת אימייל תקינה.",
      phone: "יש להזין מספר טלפון תקין.",
      city: "יש להזין עיר.",
      ageRange: "יש לבחור טווח גיל תקין.",
      childAgeRange: "יש לבחור טווח גיל תקין עבור הילד/ה.",
      preferredContact: "יש לבחור דרך תקינה ליצירת קשר.",
      consent: "יש לאשר יצירת קשר על מנת שצוות המחקר יוכל לפנות אלייך."
    }
  },
  en: {
    meta: {
      title: "Down Syndrome Pregnancy Research Study | Bar-Ilan University"
    },
    nav: {
      study: "Study",
      why: "Why It Matters",
      join: "Join",
      languageLabel: "Language selection",
      primaryLabel: "Primary navigation"
    },
    brand: {
      title: "The Paul Feder Laboratory for Alzheimer's Disease Research at Bar-Ilan University",
      subtitle: "Research Recruitment"
    },
    hero: {
      eyebrow: "Bar-Ilan University Research Study",
      title: "Every Mother Carries a Story. Some Stories Can Change Science.",
      subtitle: [
        "Pregnancy creates a lifelong biological connection between mother and child.",
        "Researchers in Prof. Eitan Okun's laboratory at Bar-Ilan University are investigating whether biological signals transferred during pregnancy may influence maternal brain health years later.",
        "If you are the mother of a child with Down syndrome, your participation could help advance research into the relationship between pregnancy, Down syndrome, and Alzheimer's disease."
      ],
      impact:
        "One blood donation may help answer questions science has never been able to answer before.",
      primaryCta: "Join the Study",
      secondaryCta: "Why This Matters"
    },
    video: {
      title: "A Personal Invitation from Prof. Eitan Okun",
      subtitle: "Why this research matters, and how your participation can help advance the study.",
      placeholderTitle: "Reserved space for a personal invitation video",
      placeholderHeading: "The invitation video will appear here",
      placeholderText:
        "When the video is ready, it will play directly on this website without sending visitors to YouTube.",
      playLabel: "Play the invitation video",
      unsupported: "Your browser does not support embedded video."
    },
    research: {
      eyebrow: "Why This Research Matters",
      title: "Why Are We Studying Mothers of Children with Down Syndrome?",
      intro: [
        "Pregnancy involves an extraordinary biological connection between mother and child. During pregnancy, cells, proteins, DNA, and other biological materials can pass between the fetus and the mother. Researchers have found that some fetal cells can be detected in the mother's body many years later.",
        "Several studies have observed differences in long-term brain health among mothers of children with Down syndrome, but the biological factors underlying these findings are still not well understood. We are also interested in understanding whether these biological processes may be relevant to conditions related to brain aging, including Alzheimer's disease.",
        "Our research aims to examine whether biological signals exchanged during pregnancy may contribute to long-term maternal health. By studying these processes, we hope to advance scientific understanding of pregnancy, aging, and brain health, and to support future research in this field.",
        "If you are the mother of a child with Down syndrome, your participation may help advance research on pregnancy, maternal health, and long-term brain health."
      ],
      cards: [
        {
          title: "Women & Brain Health",
          text: "Understanding the factors that influence women's brain health across the lifespan is an important area of medical research."
        },
        {
          title: "Down Syndrome & Maternal Health",
          text: "Previous studies have identified differences in long-term brain health among mothers of children with Down syndrome, highlighting important questions for further research."
        },
        {
          title: "Mother-Fetus Connection",
          text: "During pregnancy, cells and biological materials can pass from the fetus into the mother's body."
        },
        {
          title: "Our Research",
          text: "Preliminary findings suggest that biological materials exchanged during pregnancy may remain detectable in mothers for many years."
        },
        {
          title: "What We Are Investigating",
          text: "Whether these processes may be related to maternal brain health across the lifespan."
        }
      ],
      closing:
        "Your participation can help researchers better understand how pregnancy may influence maternal health and brain health across the lifespan."
    },
    participation: {
      eyebrow: "Participation & Registration",
      title: "Who Can Participate?",
      eligibility: [
        "Mother of a child with Down syndrome",
        "Age 18 or older",
        "Willing to donate a blood sample"
      ],
      involvementTitle: "What Does Participation Involve?",
      involvement: [
        "One blood donation",
        "A short questionnaire",
        "Approximately 15-30 minutes of your time",
        "Optional future contact regarding related studies"
      ],
      whyTitle: "Why Participate?",
      whyIntro: "Your participation may help us:",
      reasons: [
        "Better understand the long-term biological effects of pregnancy",
        "Identify biological markers that may be associated with Alzheimer's disease risk",
        "Advance research that may one day support earlier detection",
        "Expand knowledge about women's health across the lifespan"
      ],
      final:
        "Every blood sample represents a personal story and helps us move closer to understanding questions that remain unanswered."
    },
    form: {
      eyebrow: "Registration Form",
      title: "We would be happy to know if you are interested in receiving more information or joining the study",
      description:
        "Thank you for considering participation. After you submit this form, the research team may contact you to discuss eligibility and scheduling. Registration does not guarantee eligibility.",
      eligibilityTitle: "Who Can Participate?",
      eligibility: [
        "Mother of a child with Down syndrome",
        "Age 18 or older",
        "Willing to donate a blood sample"
      ],
      involvementTitle: "What Does Participation Involve?",
      involvement: [
        "One blood donation",
        "A short questionnaire",
        "Approximately 15-30 minutes of your time",
        "Optional future contact regarding related studies"
      ],
      fields: {
        fullName: "Full Name",
        email: "Email",
        phone: "Phone Number",
        city: "City",
        ageRange: "Age Range",
        childAgeRange: "Child's Age Range",
        preferredContact: "Preferred Contact Method",
        comments: "Additional Comments"
      },
      placeholders: {
        select: "Select one",
        comments: "Share any preferences, questions, or scheduling notes."
      },
      contactMethods: {
        Email: "Email",
        Phone: "Phone",
        Either: "Either"
      },
      consentTitle: "I agree to be contacted by the research team regarding this study.",
      consentHelper: "This lets the team follow up about eligibility, scheduling, and next steps.",
      submit: "Register Your Interest",
      submitting: "Submitting...",
      duplicate:
        "This registration was already submitted. Please wait before submitting the same details again.",
      consentRequired: "Please provide consent so the research team can contact you about this study.",
      genericError: "Something went wrong while submitting your form. Please try again in a moment.",
      successFallback:
        "Thank you for reaching out. We have received your interest, and a confirmation email has been sent. If the study may be a good fit, our research team may contact you with more information.",
    },
    footer: {
      credit: "With gratitude to the mothers and families who make meaningful scientific research possible."
    },
    api: {
      invalidBody: "Invalid request body. Please submit the form again.",
      missingConfig:
        "Registration backend is not configured. Please set environment variables and try again.",
      unreachable:
        "The registration service is temporarily unreachable. Please try again in a few minutes.",
      defaultSuccess:
        "Thank you for reaching out. We have received your interest, and a confirmation email has been sent. If the study may be a good fit, our research team may contact you with more information.",
      errors: {
        sheet_write_failed: "We could not save your registration to the study database.",
        sheet_unavailable: "Our registration system is temporarily unavailable. Please try again shortly.",
        validation_error: "Some details in your form need correction. Please review and submit again.",
        email_failed:
          "Your registration could not be completed due to an email service issue. Please try again shortly.",
        unauthorized: "Registration service authentication failed. Please contact the site administrator.",
        misconfigured: "Registration service is not fully configured yet. Please contact the site administrator.",
        apps_script_access_denied:
          "The registration service is connected, but the Google Apps Script deployment is blocking access. Please contact the site administrator.",
        default: "Unable to submit your registration right now. Please try again in a moment."
      }
    },
    validation: {
      invalidPayload: "Invalid submission payload.",
      fullName: "Full name is required.",
      email: "Please provide a valid email address.",
      phone: "Please provide a valid phone number.",
      city: "City is required.",
      ageRange: "Please select a valid age range.",
      childAgeRange: "Please select a valid child age range.",
      preferredContact: "Please select a valid preferred contact method.",
      consent: "Please provide consent so the research team can contact you."
    }
  }
} as const;

export type Translation = (typeof translations)[Language];
