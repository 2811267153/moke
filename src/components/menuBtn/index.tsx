import React from 'react';

class ProgressBar extends React.Component {
  private progressBarRef: React.RefObject<unknown>;
  constructor(props: {} | Readonly<{}>) {
    super(props);

    this.state = {
      value: 0,
      isDragging: false,
      mouseStartX: 0,
      barWidth: 0,
    };

    this.progressBarRef = React.createRef();

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  handleMouseDown(e: { clientX: any; }) {
    const bar = this.progressBarRef.current;
    // @ts-ignore
    const barWidth = bar.offsetWidth;
    const mouseStartX = e.clientX;
    const value = (mouseStartX / barWidth) * 100;

    this.setState({
      isDragging: true,
      mouseStartX,
      barWidth,
      value,
    });

    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }

  handleMouseMove(e) {
    if (!this.state.isDragging) {
      return;
    }

    const bar = this.progressBarRef.current;
    // @ts-ignore
    const barWidth = bar.offsetWidth;
    const mouseCurrentX = e.clientX;
    // @ts-ignore
    const mouseDiff = mouseCurrentX - this.state.mouseStartX;
    const valueDiff = (mouseDiff / barWidth) * 100;
    const newValue = this.state.value + valueDiff;

    if (newValue < 0) {
      this.setState({ value: 0 });
    } else if (newValue > 100) {
      this.setState({ value: 100 });
    } else {
      this.setState({ value: newValue });
    }
  }

  handleMouseUp(e: any) {
    this.setState({ isDragging: false });

    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

  render() {
    const { value } = this.state;

    return (
      <div
        className="progress-bar"
        ref={this.progressBarRef}
        onMouseDown={this.handleMouseDown}
      >
        <div className="bar" style={{ width: `${value}%` }}></div>
      </div>
    );
  }
}

export default ProgressBar;
