const THREE = window.MINDAR.IMAGE.THREE;
import {loadGLTF, loadAudio} from "./libs/loader.js";

document.addEventListener('DOMContentLoaded', () => {
	const start = async() => {
		const mindarThree = new window.MINDAR.IMAGE.MindARThree({
			container: document.body,
			imageTargetSrc: './abc.mind',
			maxTrack: 3,
		});
		
		const {renderer, scene, camera} = mindarThree;
		
		const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
		scene.add(light);
		
		const dog = await loadGLTF("./dog/scene.gltf");
		dog.scene.scale.set(0.5, 0.5, 0.5);
		
		const dogMixer = new THREE.AnimationMixer(dog.scene);
		const dogAction = dogMixer.clipAction(dog.animations[0]);
		dogAction.play();
		// calling airplaneClip and we are loading the audio from our hard disk
		const dogAclip = await loadAudio("./sound/dog.mp3");
		// we instantiated the THREE listener component using airListener variable
		const dogListener = new THREE.AudioListener();
		// instantiated a speaker positional audio as airplaneAudio
		const dogAudio = new THREE.PositionalAudio(dogListener);	
		
		
		const elephant = await loadGLTF("./elephant/scene.gltf");
		elephant.scene.scale.set(0.2, 0.2, 0.2);
		
		const elephantMixer = new THREE.AnimationMixer(elephant.scene);
		const elephantAction = elephantMixer.clipAction(elephant.animations[0]);
		elephantAction.play();
		
		const elephantAclip = await loadAudio("./sound/elephant.mp3");
		const elephantListener = new THREE.AudioListener();
		const elephantAudio = new THREE.PositionalAudio(elephantListener);	
		
		const fish = await loadGLTF("./fish/scene.gltf");
		fish.scene.scale.set(0.3, 0.3, 0.3);
		fish.scene.position.set(0, -0.1, 0);
		
		const fishMixer = new THREE.AnimationMixer(fish.scene);
		const fishAction = fishMixer.clipAction(fish.animations[0]);
		fishAction.play();
		
		const fishAclip = await loadAudio("./sound/fish.mp3");
		const fishListener = new THREE.AudioListener();
		const fishAudio = new THREE.PositionalAudio(fishListener);	
		
		const dogAnchor = mindarThree.addAnchor(0);
		dogAnchor.group.add(dog.scene);
		// added listener to the camera
		camera.add(dogListener);
		// we set the referal distance from which the audio should fade out
		dogAudio.setRefDistance(100);
		// set the buffer of audio to stream
		dogAudio.setBuffer(dogAclip);
		// we sset the audio to loop
		dogAudio.setLoop(true);
		// we added the audio to the anchor of airplane which will be activated on seeing  the airplane image
		dogAnchor.group.add(dogAudio)
		
		// make airplane audio play only when the target of airplane image is detected
		dogAnchor.onTargetFound = () => {
			dogAudio.play();
		}
		// make airplane audio pause then the target image is lost in the camera
		dogAnchor.onTargetLost = () => {
			dogAudio.pause();
		}
		
		
		const elephantAnchor = mindarThree.addAnchor(1);
		elephantAnchor.group.add(elephant.scene);
		
		camera.add(elephantListener);
		elephantAudio.setRefDistance(100);
		elephantAudio.setBuffer(elephantAclip);
		elephantAudio.setLoop(true);
		elephantAnchor.group.add(elephantAudio)
		elephantAnchor.onTargetFound = () => {
			elephantAudio.play();
		}
		elephantAnchor.onTargetLost = () => {
			elephantAudio.pause();
		}
		
		
		const fishAnchor = mindarThree.addAnchor(2);
		fishAnchor.group.add(fish.scene);
		
		camera.add(fishListener);
		fishAudio.setRefDistance(100);
		fishAudio.setBuffer(fishAclip);
		fishAudio.setLoop(true);
		fishAnchor.group.add(fishAudio)
		fishAnchor.onTargetFound = () => {
			fishAudio.play();
		}
		fishAnchor.onTargetLost = () => {
			fishAudio.pause();
		}
		
		const clock = new THREE.Clock();
		
		
		await mindarThree.start();		
		
		renderer.setAnimationLoop(() => {
			const delta = clock.getDelta();
			dogMixer.update(delta);
			elephantMixer.update(delta);
			fishMixer.update(delta);
			fish.scene.rotation.set(0, fish.scene.rotation.y + delta, 0);
			renderer.render(scene, camera);
		});
	}
	start();
	
});