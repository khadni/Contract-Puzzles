const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");

describe("Game5", function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory("Game5");
    const game = await Game.deploy();

    const threshold = "0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf";

    let Johnny, Johnny_adr;

    while (true) {
      const signer = ethers.Wallet.createRandom().connect(ethers.provider);
      const address = await signer.getAddress();
      if (address < threshold) {
        Johnny = signer;
        Johnny_adr = address;
        break;
      }
    }

    return { game, Johnny, Johnny_adr };
  }
  it("should be a winner", async function () {
    const { game, Johnny, Johnny_adr } = await loadFixture(
      deployContractAndSetVariables
    );

    const payer = ethers.provider.getSigner();
    await payer.sendTransaction({
      to: Johnny_adr,
      value: ethers.utils.parseEther("1"),
    });

    await game.connect(Johnny).win();

    // leave this assertion as-is
    assert(await game.isWon(), "You did not win the game");
  });
});
