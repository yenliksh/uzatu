const { createClient } = require("@supabase/supabase-js");

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Yenlikwedding2026";

function jsonResponse(body, status = 200) {
  return {
    statusCode: status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
    body: JSON.stringify(body),
  };
}

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key)
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_KEY (or SUPABASE_ANON_KEY) required",
    );
  return createClient(url, key);
}

exports.handler = async (event, context) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
      body: "",
    };
  }

  if (event.httpMethod === "POST") {
    try {
      const body = JSON.parse(event.body || "{}");
      const { name, contact, will_attend, guest_count, message } = body;
      if (!name || !contact || typeof will_attend !== "boolean") {
        return jsonResponse(
          { error: "Аты-жөніңізді, байланысты және келетініңізді көрсетіңіз" },
          400,
        );
      }
      const count = Math.max(1, Math.min(Number(guest_count) || 1, 20));
      const supabase = getSupabase();
      const { error } = await supabase.from("rsvp").insert({
        name: String(name).trim(),
        contact: String(contact).trim(),
        will_attend: Boolean(will_attend),
        guest_count: count,
        message: message ? String(message).trim() : null,
      });
      if (error) throw error;
      return jsonResponse({ success: true });
    } catch (e) {
      console.error(e);
      const message = e.message || String(e);
      return jsonResponse(
        { error: "Сақтау қатесі", detail: message },
        500
      );
    }
  }

  if (event.httpMethod === "GET") {
    const password =
      event.headers.authorization?.replace("Bearer ", "") ||
      (event.queryStringParameters && event.queryStringParameters.password);
    if (password !== ADMIN_PASSWORD) {
      return jsonResponse({ error: "Құпия сөз қате" }, 401);
    }
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("rsvp")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      const list = (data || []).map((row) => ({
        ...row,
        will_attend: row.will_attend ? 1 : 0,
        id: row.id,
      }));
      return jsonResponse(list);
    } catch (e) {
      console.error(e);
      const message = e.message || String(e);
      return jsonResponse(
        { error: "Жүктеу қатесі", detail: message },
        500
      );
    }
  }

  return jsonResponse({ error: "Method not allowed" }, 405);
};
