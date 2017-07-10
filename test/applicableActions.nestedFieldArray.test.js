import applicableActions from "../src/applicableActions";

const DISPLAY_MESSAGE_SIMPLE = {
  type: "message",
  params: { validationMessage: "Get the employees working in microsoft and status in active or paid-leave" },
};

let rulesSimple = [ 
	{
		conditions: {
		and: [
			{ and: [{ company: { is: 'microsoft' } }, 
				{or: [{ 'status': { equal: 'paid-leave' } }, { 'status': { equal: 'active' } } ]
			 }]}
		],
		},
		event: DISPLAY_MESSAGE_SIMPLE
}];

test("check simple json work", function() {
  let factsSimple = { accountId: 'Lincoln', company: 'microsoft', status: 'paid-leave', ptoDaysTaken: ['2016-12-25', '2016-12-28'] }
  expect(applicableActions(rulesSimple, factsSimple)).toEqual([DISPLAY_MESSAGE_SIMPLE]);
  factsSimple = { accountId: 'Lincoln', company: 'ibm', status: 'paid-leave', ptoDaysTaken: ['2016-12-25', '2016-12-28'] }
  expect(applicableActions(rulesSimple, factsSimple)).toEqual([]);
});

const DISPLAY_MESSAGE_NESTED_SIMPLE = {
  type: "message",
  params: { validationMessage: "Get the employees working in microsoft and status in active or paid-leave" },
};

let rulesNestedSimple = [ 
	{
		conditions: {
		and: [
			{ accountId: { is: 'Lincoln' } },
			{ and: [{ company: { is: 'microsoft' } }, 
				{or: [{ 'status.code.description': { equal: 'paid-leave' } }, { 'status.code.description': { equal: 'active' } } ]
			 }]}
		],
		},
		event: DISPLAY_MESSAGE_NESTED_SIMPLE
}];

test("check simple nested json work", function() {
  let factsNestedSimple = { accountId: 'Lincoln', company: 'microsoft', status: { code: {'description': 'paid-leave'}}, ptoDaysTaken: ['2016-12-25', '2016-12-28'] }
  expect(applicableActions(rulesNestedSimple, factsNestedSimple)).toEqual([DISPLAY_MESSAGE_NESTED_SIMPLE]);
  factsNestedSimple = { accountId: 'Lincoln', company: 'microsoft', status: { code: {'description': 'active'}}, ptoDaysTaken: ['2016-12-25', '2016-12-28'] }
  expect(applicableActions(rulesNestedSimple, factsNestedSimple)).toEqual([DISPLAY_MESSAGE_NESTED_SIMPLE]);
  factsNestedSimple = { accountId: 'Lincoln', company: 'microsoft', status: { code: {'description': 'off'}}, ptoDaysTaken: ['2016-12-25', '2016-12-28'] }
  expect(applicableActions(rulesNestedSimple, factsNestedSimple)).toEqual([]);
});

const DISPLAY_MESSAGE_NESTED_ARRAY = {
  type: "message",
  params: { validationMessage: "Get the employees working in microsoft and status in active or paid-leave" },
};

let rulesNestedArray = [ 
	{
		conditions: {
		and: [
			{ accountId: { is: 'Lincoln' } },
			{ and: [
					{ company: { is: 'microsoft' } }, 
					{
						status: 
						{
							or: [{ 'code': { equal: 'paid-leave' } }, { 'code': { equal: 'active' } } ]
						}
					}
				]
			}
		],
		},
		event: DISPLAY_MESSAGE_NESTED_ARRAY
}];

test("check simple nested array work", function() {
  let factsNestedArray = { accountId: 'Lincoln', company: 'microsoft', status: [{ code: 'paid-leave'}, { code: 'active'}], ptoDaysTaken: ['2016-12-25', '2016-12-28'] }
  expect(applicableActions(rulesNestedArray, factsNestedArray)).toEqual([DISPLAY_MESSAGE_NESTED_ARRAY]);
  factsNestedArray = { accountId: 'Jeferryson', company: 'microsoft', status: [{ code: 'paid-leave'}, { code: 'active'}], ptoDaysTaken: ['2016-12-25', '2016-12-28'] }
  expect(applicableActions(rulesNestedArray, factsNestedArray)).toEqual([]);
});

const DISPLAY_MESSAGE_COMPLEX_NESTED_ARRAY = {
  type: "message",
  params: { validationMessage: "Get the employees working in microsoft and status in active or paid-leave" },
};

let rulesComplexNestedArray = [ 
	{
		conditions: {
			Accounts: {
			and: [
				{ accountId: { is: 'Lincoln' } },
				{ and: [{ company: { is: 'microsoft' } }, 
					{
						status: 
						{
							code: {							
								or: [{ 'description': { equal: 'paid-leave' } }, { 'description': { equal: 'active' } } ]
							}
						}
					}
					]
				}
			],
			}
		},
		event: DISPLAY_MESSAGE_COMPLEX_NESTED_ARRAY
}];

test("check nested complex array work", function() {
	let factsArrayComplexNestedArray = {
		Accounts:
			[ { accountId: 'Jefferson', company: 'microsoft', status: [{ code: [ {description: 'paid-leave'}, {description: 'half-day'}] }, { code: [ {description: 'full-day'}, {description: 'Lop'}]}], ptoDaysTaken: ['2016-12-25', '2016-12-28'] },
			  { accountId: 'Lincoln', company: 'microsoft',  status: [{ code: [ {description: 'paid-leave'}, {description: 'full-day'}] }, { code: [ {description: 'Lop'}, {description: 'active'}]}], ptoDaysTaken: ['2016-12-25', '2016-12-21'] }]
	}
	expect(applicableActions(rulesComplexNestedArray, factsArrayComplexNestedArray)).toEqual([DISPLAY_MESSAGE_COMPLEX_NESTED_ARRAY]);
   
	factsArrayComplexNestedArray = {
		Accounts:
			[ { accountId: 'Dunken', company: 'microsoft', status: [{ code: [ {description: 'paid-leave'}, {description: 'half-day'}] }, { code: [ {description: 'full-day'}, {description: 'Lop'}]}], ptoDaysTaken: ['2016-12-25', '2016-12-28'] },
			  { accountId: 'Steve', company: 'microsoft',  status: [{ code: [ {description: 'paid-leave'}, {description: 'full-day'}] }, { code: [ {description: 'Lop'}, {description: 'Sick Leave'}]}], ptoDaysTaken: ['2016-12-25', '2016-12-21'] }]
	}
	expect(applicableActions(rulesComplexNestedArray, factsArrayComplexNestedArray)).toEqual([]);
});
