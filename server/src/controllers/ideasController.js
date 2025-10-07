const Idea = require("../models/Idea");

const { isValidObjectId } = require("../utils/mongo");

async function list(req, res, next) {
  try {
    const {
      q,
      sort = "updatedAt",
      order = "desc",
      page = 1,
      pageSize = 50,
    } = req.query;
    const find = q
      ? {
          $or: [
            { title: new RegExp(q, "i") },
            { summary: new RegExp(q, "i") },
            { tags: q },
          ],
        }
      : {};
    const skip = Math.max(0, (Number(page) - 1) * Number(pageSize));
    const limit = Math.min(200, Math.max(1, Number(pageSize)));
    const [ideas, total] = await Promise.all([
      Idea.find(find)
        .sort({ [sort]: order === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(limit),
      Idea.countDocuments(find),
    ]);
    res.json({ ideas, total, page: Number(page), pageSize: limit });
  } catch (e) {
    next(e);
  }
}

async function create(req, res, next) {
  try {
    const { title, summary, tags } = req.body;
    if (!title || !summary)
      return res.status(400).json({ error: "title and summary required" });
    const idea = await Idea.create({
      title,
      summary,
      tags: Array.isArray(tags) ? tags : [],
    });
    res.status(201).json({ idea });
  } catch (e) {
    next(e);
  }
}

async function getById(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ error: "invalid id" });
    const idea = await Idea.findById(id);
    if (!idea) return res.status(404).json({ error: "not found" });
    res.json({ idea });
  } catch (e) {
    next(e);
  }
}

async function update(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ error: "invalid id" });
    const { title, summary, tags } = req.body;
    const idea = await Idea.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(title && { title }),
          ...(summary && { summary }),
          ...(tags && { tags }),
        },
      },
      { new: true }
    );
    if (!idea) return res.status(404).json({ error: "not found" });
    res.json({ idea });
  } catch (e) {
    next(e);
  }
}

async function remove(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ error: "invalid id" });
    await Idea.findByIdAndDelete(id);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}

async function count(req, res, next) {
  try {
    const total = await Idea.countDocuments({});
    res.json({ total });
  } catch (e) {
    next(e);
  }
}

module.exports = { list, create, getById, update, remove, count };
