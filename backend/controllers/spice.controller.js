import Spice from "../models/spice.model.js";

export const createSpice = async (req, res) => {
  try {
    const spice = await Spice.create(req.body); 
    res.status(201).json(spice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getSpices = async (req, res) => {
  try {
    const { search, isActive, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { supplier: { $regex: search, $options: "i" } },
      ];
    }
    if (isActive === "true") query.isActive = true;
    if (isActive === "false") query.isActive = false;

    const spices = await Spice.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limitNum);

    const totalCount = await Spice.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      spices,
      totalCount,
      totalPages,
      currentPage: pageNum,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSpice = async (req, res) => {
  try {
    const spice = await Spice.findById(req.params.id);
    if (!spice) return res.status(404).json({ message: "Spice not found" });
    res.json(spice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateSpice = async (req, res) => {
  try {
    const spice = await Spice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!spice) return res.status(404).json({ message: "Spice not found" });
    res.json(spice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteSpice = async (req, res) => {
  try {
    const spice = await Spice.findById(req.params.id);
    if (!spice) return res.status(404).json({ message: "Spice not found" });

    await spice.deleteOne();
    res.json({ message: "Spice deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
