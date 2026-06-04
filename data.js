// api/data.js — proxy server-side, resolve CORS
// O browser chama /api/data?c=fulano2026
// Este arquivo chama o Google e devolve os dados

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxuQMseF6zgGHK3f9zdPAtaOdphIF5VRrFdq-RU5NqdTO2fELSUax6WDnjXIJzVA3BQ/exec';

export default async function handler(req, res) {
  // Permite qualquer origem (CORS liberado para o cliente)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { c } = req.query;
  if (!c) {
    res.status(400).json({ error: 'Parâmetro "c" não informado.' });
    return;
  }

  try {
    const googleRes = await fetch(`${SCRIPT_URL}?c=${encodeURIComponent(c)}`, {
      redirect: 'follow',
    });

    if (!googleRes.ok) {
      throw new Error(`Google respondeu com status ${googleRes.status}`);
    }

    const data = await googleRes.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar dados: ' + err.message });
  }
}
