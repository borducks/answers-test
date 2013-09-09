<?php
/**
*  Events Model
*/
class events
{
	
	function __construct()
	{
	}

	public function get_all_events()
	{
		// return all events
		$sql = "select * from events";
		$result = mysql::query('main', $sql);
		if(PEAR::isError($result))
		{
			return FALSE;
		}
		foreach($result as $row)
		{
			$row['title'] = stripslashes($row['title']);
			$row['description'] = stripslashes($row['description']);
			$events[] = $row;
		}
		return (isset($events)) ? $events : false;
	}

	public function add($event_obj)
	{
		// add an event to the db

		$title = mysql_real_escape_string($event_obj['title']);
		$start = strtotime($event_obj['start']);
		$end = strtotime($event_obj['end']);
		if (! $end) {
			// if empty end, set to start
			$end = $start;
		}
		$description = mysql_real_escape_string($event_obj['description']);
		$user_id = $event_obj['user_id'];
		if ($event_id = $event_obj['id']) {
			// if id passed in, update. otherwise create new event
			$sql = "UPDATE `events` SET `title`='$title', `start`='$start', `end`='$end', `description`='$description', `user_id`='$user_id' WHERE `id`=$event_id";
		} else {
			$sql = sprintf("INSERT INTO `events`  (`title`,`start`,`end`,`description`,`user_id`) VALUES ('%s', %d, %d, '%s', %d)", $title, $start, $end, $description, $user_id);
		}

		$result = mysql::query('main', $sql);

		if(PEAR::isError($result))
		{
			return FALSE;
		}
		return TRUE;
	}

	public function delete($event_id)
	{
		// delete an event by id
		if (! is_numeric($event_id)) {
			return FALSE;
		}

		$sql = "DELETE FROM `events` WHERE `id` = $event_id LIMIT 1";
		$result = mysql::query('main', $sql);
		if(PEAR::isError($result))
		{
			return FALSE;
		}
		return TRUE;
	}
}


?>