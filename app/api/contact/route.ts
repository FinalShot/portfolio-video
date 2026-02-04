import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
  email: z.string().email("Email invalide."),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères."),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message ?? "Données invalides." },
        { status: 400 },
      );
    }

    const { name, email, message } = parsed.data;

    const resendApiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_EMAIL || "contact@portfolio.jeanlanot.com";

    if (!resendApiKey) {
      console.error("RESEND_API_KEY manquante");
      return NextResponse.json(
        { success: false, error: "Configuration serveur manquante." },
        { status: 500 },
      );
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Jean Lanot Portfolio <contact@portfolio.jeanlanot.com>",
        to: toEmail,
        subject: `Nouveau message de ${name}`,
        reply_to: email,
        text: `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `
          <h2>Nouveau message depuis le portfolio</h2>
          <p><strong>Nom:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p>${message.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br />")}</p>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Resend API error:", errorData || response.statusText);
      return NextResponse.json(
        { success: false, error: "Erreur lors de l'envoi du message." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de l'envoi du message." },
      { status: 500 },
    );
  }
}
