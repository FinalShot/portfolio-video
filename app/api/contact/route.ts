import { NextResponse, NextRequest } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const isAllowed = rateLimit(ip, 3, 5 * 60 * 1000); // 3 emails per 5 min

    if (!isAllowed) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Trop de requêtes. Veuillez réessayer dans quelques minutes.",
        },
        { status: 429 }
      );
    }

    const { name, email, message } = await request.json();

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Tous les champs sont requis." },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        {
          success: false,
          error: "Le nom est trop long (max 100 caractères).",
        },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        {
          success: false,
          error: "Le message est trop long (max 5000 caractères).",
        },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "L'adresse email n'est pas valide." },
        { status: 400 }
      );
    }

    // Sanitize HTML
    const sanitize = (str: string) =>
      str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;");

    const safeName = sanitize(name);
    const safeMessage = sanitize(message);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Jean Lanot Portfolio <contact@portfolio.jeanlanot.com>",
        to: process.env.CONTACT_EMAIL || "contact@jeanlanot.com",
        subject: `Nouveau message de ${safeName}`,
        reply_to: email,
        text: `Nom: ${safeName}\nEmail: ${email}\n\nMessage:\n${safeMessage}`,
        html: `
          <h2>Nouveau message depuis le portfolio</h2>
          <p><strong>Nom:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p>${safeMessage.replace(/\n/g, "<br />")}</p>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Resend API error:", errorData);

      return NextResponse.json(
        {
          success: false,
          error: "Erreur lors de l'envoi du message. Veuillez réessayer.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de l'envoi du message. Veuillez réessayer.",
      },
      { status: 500 }
    );
  }
}
