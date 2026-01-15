import { ethers } from "ethers";

const MACE_ROUTER = "0x0b79d71ae99528d1db24a4148b5f4f865cc2b137";

const SWAP_ABI = [
  "event Swap(address indexed sender,uint amount0In,uint amount1In,uint amount0Out,uint amount1Out,address indexed to)"
];

export default async function handler(req, res) {
  try {
    const { address, period } = req.query;
    if (!address) {
      return res.status(400).json({ error: "Wallet required" });
    }

    const provider = new ethers.JsonRpcProvider(process.env.MONAD_RPC_URL);
    const contract = new ethers.Contract(MACE_ROUTER, SWAP_ABI, provider);

    const latestBlock = await provider.getBlockNumber();

    // block ranges (safe for RPC)
    let fromBlock = latestBlock - 50_000;
    if (period === "7d") fromBlock = latestBlock - 20_000;
    if (period === "30d") fromBlock = latestBlock - 60_000;

    const events = await contract.queryFilter(
      "Swap",
      fromBlock,
      latestBlock
    );

    let volume = 0;

    for (const e of events) {
      if (e.args.to.toLowerCase() === address.toLowerCase()) {
        const traded =
          e.args.amount0In > 0
            ? e.args.amount0In
            : e.args.amount1In;

        volume += Number(ethers.formatUnits(traded, 18));
      }
    }

    res.status(200).json({
      address,
      period,
      volume: volume.toFixed(4)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
