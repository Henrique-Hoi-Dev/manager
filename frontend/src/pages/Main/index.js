import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import plus from '../../assets/plus.svg';

import pt from 'date-fns/locale/pt';

import {
  Button,
  Form,
  FormLabel,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap';
import { Container, Spanstatus, HeaderTodoList } from './styles';

import {
  getByIdProjectRequest,
  findAllProjectRequest,
} from '~/store/modules/project/actions';

import api from '~/services/api';

import ProjectsView from '~/components/Project';

export default function Main() {
  const dispatch = useDispatch();
  const { id } = useSelector((state) => state.user.profile);
  const { _id, lists } =
    useSelector((state) => state.user.currentProject) || {};

  useEffect(() => {
    function onLoad() {
      try {
        /**
         * Carrega os projects do content
         */
        dispatch(findAllProjectRequest({ id: id }));

        if (_id) {
          return dispatch(getByIdProjectRequest({ id: _id }));
        }
      } catch (e) {
        console.log(e);
      }
    }
    onLoad();
  }, [id, _id, dispatch]); // eslint-disable-next-line

  function dateFormat(newDate) {
    let data = new Date(newDate);
    return `${data.getDate() + 1}/
    ${
      data.getMonth() + 1 < 9 ? `0${data.getMonth() + 1}` : data.getMonth() + 1
    }/
    ${data.getFullYear()}`;
  }

  /************************   HANDLERS   ******************************/
  /**
   *
   * Remove a lista do projeto -- DONE
   */
  async function onHandlerClickRemoveList(event) {
    try {
      await api.delete(`/project/project/${event.target.value}`);
      toast.success('List successfully deleted.');

      console.log('removeu a lista');

      return dispatch(findAllProjectRequest({ id: id }));
    } catch (error) {
      toast.error(error);
    }
  }

  async function onHandlerClickRemoveTask(event) {
    try {
      await api.delete(`/lists/task/${event.target.value}`);
      toast.success('Task successfully deleted.');
      console.log('removeu a tarefa');
      return dispatch(getByIdProjectRequest({ id: _id }));
    } catch (error) {
      toast.error(error);
    }
  }

  async function onHandlerChangeCkeckComplete(event) {
    if (event.target.checked) {
      const confirm = window.confirm('You want to finish this task?');
      if (confirm) {
        await api.put(`/lists/task/${event.target.value}/done`);
        toast.success('Task successfully done.');
        return dispatch(getByIdProjectRequest({ id: id }));
      } else {
        return;
      }
    }
  }

  /************************   RENDERS   ******************************/
  function renderButtonAddListFromProject() {
    return (
      <div className="lists-content" hidden={_id ? '' : 'hidden'}>
        <Form>
          <Form.Label>Lists</Form.Label>
          <br />
          <Link key="new" to={`/list/new/${id}`}>
            <Button className="button-new-list" variant="info">
              <b>{'\uFF0B'}</b>ADD
            </Button>
          </Link>
        </Form>
      </div>
    );
  }

  function renderListFromProject(lists) {
    return [].concat(lists).map((list, i) => (
      <div className="col-md-3" key={i}>
        <FormLabel>{list.title}</FormLabel>
        <hr />
        <ListGroup>{renderTaskList(list.task, list.id)}</ListGroup>
        <hr />
      </div>
    ));
  }

  function renderTaskList(tasks, listId) {
    return [{}].concat(tasks).map((task, i) =>
      i !== 0 ? (
        <ListGroupItem key={i} className="description-card">
          <span>
            <b>
              {task.title} -{' '}
              <Spanstatus attrDone={task.done ? true : false}>
                {task.done ? 'Done!' : 'Pending..'}{' '}
              </Spanstatus>
            </b>
            <div className="mr-auto"></div>
            <span>Check for Done </span>
            <input
              type="checkbox"
              value={task.id}
              checked={task.done ? true : false}
              disabled={task.done ? true : false}
              onChange={onHandlerChangeCkeckComplete}
              aria-label="Checkbox for complete task"
            ></input>
            <div className="mr-auto"></div>
            Conclusion: {dateFormat(task.dateCompletion)}
          </span>
          <hr />
          <div className="mr-auto"></div>
          <p>{task.description}</p>
          <hr />
          <Button
            disabled={task.done ? true : false}
            className="button-edit-card"
            variant="outline-danger"
            onClick={onHandlerClickRemoveTask}
            value={task._id}
          >
            Delete
          </Button>

          <span>
            {' Create at: ' +
              format(new Date(task.createdAt), 'dd/MM/yyyy', { locale: pt })}
          </span>
        </ListGroupItem>
      ) : (
        <ListGroupItem key="new">
          <Link className="button" to={`/task/new/${listId}`}>
            <Button variant="outline-info">
              <b>{plus}</b>&nbsp;Task
            </Button>
          </Link>
          <Button
            className="button-remove-list"
            variant="secondary"
            onClick={onHandlerClickRemoveList}
            value={listId}
          >
            Delete
          </Button>
        </ListGroupItem>
      )
    );
  }

  return (
    <Container>
      <HeaderTodoList>TODO LIST</HeaderTodoList>
      <div className="row">
        <div className="col-md-6">{renderButtonAddListFromProject()}</div>
        <div className="col-md-6">
          <ProjectsView />
        </div>
      </div>
      <div className="list-render row">
        {renderListFromProject(lists ? lists : [])}
      </div>
    </Container>
  );
}
