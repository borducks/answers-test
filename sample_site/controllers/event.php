<?php
/**
* Event Controller
*/
class event_controller extends base_controller
{
	var $model_ref;

	public function _pre()
	{
		// init model instance before action
		// yep. seems to work.
		$this->model_ref = new events();
	}
	
	public function index()
	{
		// query all the events
		$this->events = $this->model_ref->get_all_events();
		$this->layout_title = "All Events";
	}

	public function month()
	{
		// display month grid
	}

	public function aslist()
	{
		// display basic list
	}

	public function ajaxadd()
	{
		// field a new event via ajax
		$this->disable_layout();
		$this->set_view('ajax');

		$this->result = $this->model_ref->add($_POST);
	}

	public function ajaxdelete()
	{
		// delete an event
		$this->disable_layout();
		$this->set_view('ajax');

		$this->result = $this->model_ref->delete($_POST['id']);
	}

	public function ajaxedit()
	{
		// update an event
		$this->disable_layout();
		$this->set_view('ajax');

		$this->result = $this->model_ref->update($_POST);
	}

	public function ajaxgetall()
	{
		// get all events via ajax
		$this->disable_layout();
		$this->set_view('ajax');
		$this->events = $this->model_ref->get_all_events();
		$this->result = json_encode($this->events);
	}

	public function getMonthInfo($month)
	{
		$this->disable_layout();
		$this->set_view('ajax');
		$this->result = $month;
	}

}
?>