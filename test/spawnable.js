const { should } = require('chai').should();
const { start } = require('../lib');
const { Promise } = require('bluebird');
const delay = Promise.delay;

describe('Actor', function () {
  let system = start();

  describe('spawning', function () {
    it('registers and deregisters children with parent upon startup and shutdown', async function () {
      let child = system.spawn(() => tell(sender, children), 'testChildActor');
      
      system.children.should.have.key('testChildActor');      
      
      let children = await child.ask();            
      Object.keys(children).should.have.length(0, 'actor should not have children yet');

      let grandchild = child.spawn(() => { }, 'testGrandchildActor');            
      await delay(100);
      children = await child.ask();      
      children.should.have.keys('testGrandchildActor');      
      child.children.should.have.keys('testGrandchildActor');
      
      let grandchild2 = child.spawn(() => { }, 'testGrandchildActor2');            
      await delay(100);
      children = await child.ask();      
      child.children.should.have.keys('testGrandchildActor2','testGrandchildActor');
      children.should.have.keys('testGrandchildActor2','testGrandchildActor');      

      grandchild.stop();
      await delay(100);
      children = await child.ask();
      children.should.have.keys('testGrandchildActor2');            
      child.children.should.have.keys('testGrandchildActor2');

      child.stop();            
      await delay(100);
      grandchild.isStopped.should.be.true;
      system.children.should.not.have.key('testChildActor');      

    });

    it('shutdowns automatically when a function is not returned', async function(){

    });

  });

  describe('#spawn()', function () {
    it('shutdowns automatically when function returns false', async function(){
      let actor = system.spawn((msg)=> !!msg);
    });

  });


  // describe.skip('#spawn()');
});