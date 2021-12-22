const { assert } = require('chai')

const DInstagram = artifacts.require('./DInstagram.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('DInstagram', ([deployer, author, tipper]) => {
  let dInstagram

  before(async () => {
    dInstagram = await DInstagram.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await dInstagram.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await dInstagram.name()
      assert.equal(name, 'DInstagram')
    })
  })

  describe('images', async () => {
    let result
    let imageCount
    const hash = 'agdkkQkjkdfhkyDheuiGGTinVYGFjjj35hj8'

    before(async () => {
      result = await dInstagram.uploadImage(hash, 'Image description', { from: author })
      imageCount = await dInstagram.imageCount()
    })


    it('Create images', async () => {
      //SUCCESS
      assert.equal(imageCount, 1)
      const event = result.logs[0].args
      assert.equal(event._id.toNumber(), imageCount.toNumber(), 'id is correct')
      assert.equal(hash, event._hash, 'Hash is correct')
      assert.equal(event._description, 'Image description', 'Description is correct')
      assert.equal(event._tipAmount, '0', 'Tip amount is correct')
      assert.equal(event._author, author, 'Author is correct')

      //FAILURE: Image must have a Hash (must nor be empty)
      await dInstagram.uploadImage('', 'Image description', { from: author }).should.be.rejected

      //FAILURE: Description must not be empty
      await dInstagram.uploadImage(hash, '', { from: author }).should.be.rejected
    })

    it('lists images', async () => {
      const image = await dInstagram.images(imageCount)
      assert.equal(image.id.toNumber(), imageCount.toNumber(), 'id is correct')
      assert.equal(hash, image.hash, 'Hash is correct')
      assert.equal(image.description, 'Image description', 'Description is correct')
      assert.equal(image.tipAmount, '0', 'Tip amount is correct')
      assert.equal(image.author, author, 'Author is correct')
    })
  })
})