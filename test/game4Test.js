const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");

describe("Game4", function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory("Game4");
    const game = await Game.deploy();

    const Johnny = ethers.provider.getSigner(0);
    const Rachel = ethers.provider.getSigner(1);
    const Johnny_adr = await Johnny.getAddress();
    const Rachel_adr = await Rachel.getAddress();

    return { game, Johnny, Rachel, Johnny_adr, Rachel_adr };
  }
  it("should be a winner", async function () {
    const { game, Johnny, Rachel, Johnny_adr, Rachel_adr } = await loadFixture(
      deployContractAndSetVariables
    );

    // nested mappings are rough :}
    await game.connect(Johnny).write(Rachel_adr);

    await game.connect(Rachel).win(Johnny_adr);

    // leave this assertion as-is
    assert(await game.isWon(), "You did not win the game");
  });
});
