require('dotenv').config();
import OpenTok from 'opentok';

const rooms = {};

const opentok = new OpenTok(process.env.API_KEY, process.env.API_SECRET);

export default (req, res) => {
  const {
    query: { room },
  } = req;

  if (rooms[room]) {
    const { sessionId } = rooms[room];
    const token = opentok.generateToken(sessionId);
    res.statusCode = 200;
    res.json({ apiKey: process.env.API_KEY, sessionId, token });
    return;
  }

  opentok.createSession({ mediaMode: "routed" }, (err, { sessionId }) => {
    const token = opentok.generateToken(sessionId);
    res.statusCode = 200;
    res.json({ apiKey: process.env.API_KEY, sessionId, token });
    rooms[room] = { sessionId };
  });
}
