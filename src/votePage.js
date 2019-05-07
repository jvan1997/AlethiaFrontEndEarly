import React, { Component } from 'react';
import Voting from './vote';
import TempVote from './tempVote';
import Bar from './bar';
import Particles from 'react-particles-js';

class votePage extends Component {
 
	constructor(props) {
        super(props);
    }  

  render() {
    return (
      <div>
      <Particles
        className="bg-cover-image fixed h-screen w-screen z-n1"
        params={{
          "particles": {
            "number": {
              "value": 100
            },
            "size": {
              "value": 3
            }
          },
          "interactivity": {
            "events": {
              "onhover": {
                "enable": true,
                "mode": "repulse"
              }
            }
          }
        }}>          </Particles>
        <div class="z-n2">
	<Bar />
	<TempVote />
	</div>
  </div>
    );
  }
}
export default votePage;
