export default scriptCanvas = `
setTimeout(function(){
    var dp = slideParticles.getInstance({
      stop: false,
      mass: 10,
      density: 500,
      particleSize: 1.5,
    });
}, 2000);
`;