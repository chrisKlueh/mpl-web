// Counter.js
import React, { useState } from "react";
import { useSelector, useDispatch, connect } from "react-redux";
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  incrementIfOdd,
} from "../slices/counterSlice";
import { sagaActions } from "../actions/sagaActions";
function Counter(props) {
  // const count = useSelector(selectCount);
  const dispatch = useDispatch();
  const [incrementAmount, setIncrementAmount] = useState(2);
  const incrementValue = Number(incrementAmount) || 0;
  const { count, increment, decrement, incrementByAmount } = props;
  return (
    <div>
      <div>
        <button
          aria-label="Decrement value"
          // onClick={() => dispatch(decrement())}
          onClick={decrement}
        >
          -
        </button>
        <span>{count}</span>
        <button
          aria-label="Increment value"
          // onClick={() => dispatch(increment())}
          onClick={increment}
        >
          +
        </button>
        <button
          aria-label="Increment by value"
          // onClick={() => dispatch(increment())}
          onClick={() => incrementByAmount(incrementAmount)}
        >
          + amount
        </button>
      </div>
      <div>
        <input
          aria-label="Set increment amount"
          value={incrementAmount}
          onChange={(e) => setIncrementAmount(Number(e.target.value))}
        />
        {/* buttons */}
        {/* add random number asynchronously with redux saga */}
        <button
          onClick={() => dispatch({ type: sagaActions.FETCH_NUMBER_SAGA })}
        >
          Add Random number with Saga
        </button>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    count: state.counter.value,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    increment: () => dispatch(increment()),
    decrement: () => dispatch(decrement()),
    incrementByAmount: (amount) => dispatch(incrementByAmount(amount)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
