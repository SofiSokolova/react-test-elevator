import React from 'react';
import './App.css';

interface State {
  currentFloor: number;
  upQueue: Set<number>;
  downQueue: Set<number>;
  moveDirection: MoveDirection
}

enum MoveDirection {
  UP = "Up",
  DOWN = "Down",
  STANDING = "Standing"
}

class Elevator extends React.Component<{}, State> {

  floorNumbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  constructor(props: {}) {
    super(props);

    this.state = {
      currentFloor: this.floorNumbers[0],
      upQueue: new Set(),
      downQueue: new Set(),
      moveDirection: MoveDirection.STANDING
    };

  }

  componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<State>) {
    if (prevState.moveDirection === MoveDirection.STANDING && this.state.moveDirection !== MoveDirection.STANDING) {
      this.moveElevator();
    }
  }

  private moveElevator(): void {
    let delay = 1000;

    this.setState((state) => {
      let {moveDirection, upQueue, downQueue, currentFloor} = state;

      if (upQueue.has(currentFloor) || downQueue.has(currentFloor)) {
        upQueue = new Set(upQueue);
        downQueue = new Set(downQueue);

        upQueue.delete(currentFloor);
        downQueue.delete(currentFloor);

        if (!upQueue.size && !downQueue.size) {
          moveDirection = MoveDirection.STANDING;
        }
        if (!upQueue.size && downQueue.size) {
          moveDirection = MoveDirection.DOWN;
        }
        if (upQueue.size && !downQueue.size) {
          moveDirection = MoveDirection.UP;
        }

        delay += 2000
      }

      return {
        upQueue,
        downQueue,
        moveDirection
      };
    }, () => {
      if (this.state.moveDirection !== MoveDirection.STANDING) {
        setTimeout(() => {
          this.setState((state) => {
            const floor = state.currentFloor + (state.moveDirection === MoveDirection.UP ? 1 : -1);

            return {
              currentFloor: floor,
            }
          });
          this.moveElevator();
        }, delay)
      }
    });
  }

  handleClick(floor: number): void {
    this.setState((state) => {
      let {moveDirection, upQueue, downQueue} = state;

      if (floor > state.currentFloor) {
        upQueue = new Set(upQueue).add(floor);
        if (state.moveDirection === MoveDirection.STANDING) {
          moveDirection = MoveDirection.UP;
        }
      }

      if (floor < state.currentFloor) {
        downQueue = new Set(downQueue).add(floor);
        if (state.moveDirection === MoveDirection.STANDING) {
          moveDirection = MoveDirection.DOWN;
        }
      }

      return {
        upQueue,
        downQueue,
        moveDirection
      }
    });
  }

  render(): JSX.Element {
    const floors = this.floorNumbers.map((number) =>
      <button className={this.state.currentFloor === number ? 'current-floor' : '' } key={number.toString() }
              onClick={() => this.handleClick(number)}
              disabled={this.state.upQueue.has(number) || this.state.downQueue.has(number)}>
        {number}
      </button>
    );

    return (
      <div className='main'>
          <div className='wrapper'>
            <div className='floor-display'>{this.state.currentFloor}
              <p>{this.state.moveDirection === MoveDirection.UP && <i className="arrow-up" />}
              {this.state.moveDirection === MoveDirection.DOWN && <i className="arrow-down"/>}
                {this.state.moveDirection === MoveDirection.STANDING && '—'}</p> 
            </div>
            
            <div className='floor-btn'>
              {floors}
            </div>
          </div>
      </div>

    );
  }
}

export default Elevator;
