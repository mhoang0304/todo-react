import { Input } from "antd";
import { Button } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AddTodoSuccess } from "./redux/ActionType";
import Store from "./redux/Store";
import TodoService from "./TodoService";

export default function AxiosPlayground() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [retryCount, setRetryCount] = useState(1);

  const [inputValue, setInputValue] = useState("");

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setIsLoading(true);
  //       setIsError(false);
  //       const todoListResonse = await TodoService.GetTodoList();

  //       setTodos(todoListResonse.data.data);
  //     } catch (ex) {
  //       setIsError(true);
  //       console.log("lỗi rồi");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [retryCount]);

  //Redux thunk
  const fetchData = () => async dispatch => {
    try {
      setIsLoading(true);
      setIsError(false);

      const todoListResonse = await TodoService.GetTodoList();
      dispatch({
        type: AddTodoSuccess,
        taskList: todoListResonse
      })
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  fetchData();
  const data = useSelector((store) => store.todoState.taskList)
  console.log(data);

  const handleTryAgain = () => {
    setRetryCount(retryCount + 1);
  };

  const handleOnChange = (e) => {
    setInputValue(e.target.value);
  };

  const handlePressEnter = async () => {
    setIsLoading(true);

    try {
      await TodoService.AddTodo(inputValue);

      setInputValue("");

      setRetryCount(retryCount + 1);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return isLoading ? (
    "Loading ..."
  ) : (
    <>
      {!isError ? (
        <div>
          <div>
            <Input
              placeholder="Nhập tên task rồi ấn enter"
              value={inputValue}
              onChange={handleOnChange}
              onPressEnter={handlePressEnter}
            />
          </div>
          {todos.length}
        </div>
      ) : (
        <div>
          <Button onClick={handleTryAgain}>Try again</Button>
        </div>
      )}
    </>
  );
}
