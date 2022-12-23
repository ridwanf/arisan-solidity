const assert = require("assert");
const ganache = require("ganache");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require("../compile");

let arisan;
let accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  arisan = await new web3.eth.Contract(interface)
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Arisan Contract", () => {
  it("deploy a contract", () => {
    assert.ok(arisan.options.address);
  });

  it("allows one account to enter", async () => {
    await arisan.methods.enter("ibu satu").send({
      from: accounts[0],
      value: web3.utils.toWei("0.02", "ether"),
      gas: "1000000",
    });

    await arisan.methods.enter("ibu dua").send({
      from: accounts[1],
      value: web3.utils.toWei("0.02", "ether"),
      gas: "1000000",
    });

    await arisan.methods.enter("ibu tiga").send({
      from: accounts[2],
      value: web3.utils.toWei("0.02", "ether"),
      gas: "1000000",
    });

    const players = await arisan.methods.getPlayers().call({
      from: accounts[0],
    });

    assert.equal("ibu satu", players[0]);
    assert.equal("ibu dua", players[1]);
    assert.equal("ibu tiga", players[2]);
    assert.equal(3, players.length);
  });

  it("requires a minimum amount of ether to enter", async () => {
    try {
      await arisan.methods.enter("ibu satu").send({
        from: accounts[0],
        value: 0,
      });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it("only manager can pick winner", async () => {
    try {
      await arisan.methods.pickWinner().send({
        from: accounts[1],
      });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it("send money to the winner and resets the player array", async () => {
    await arisan.methods.enter("ibu satu").send({
      from: accounts[0],
      value: web3.utils.toWei("2", "ether"),
      gas: "1000000",
    });

    const initialBalance = await web3.eth.getBalance(accounts[0]);

    await arisan.methods.pickWinner().send({ from: accounts[0] });
    const finalBalance = await web3.eth.getBalance(accounts[0]);
    const difference = finalBalance - initialBalance;
    console.log(difference);
    assert(difference > web3.utils.toWei("1.8", "ether"));
  });
});
