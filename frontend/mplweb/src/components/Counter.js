// Counter.js
import React, { useState } from "react";
import { connect } from "react-redux";
import {
  decrement,
  increment,
  incrementByAmount,
  getUserDetail,
} from "../slices/counterSlice";
function Counter(props) {
  // const count = useSelector(selectCount);
  const [incrementAmount] = useState(2);
  const { count, increment, decrement, incrementByAmount, getUserDetail } =
    props;
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
        <button
          aria-label="get user detail"
          onClick={() =>
            getUserDetail({ id: 3, param2: "test", param3: "jimmy" })
          }
        >
          get user 3's details
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
    getUserDetail: (params) => {
      console.log(params);
      dispatch(getUserDetail(params));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
