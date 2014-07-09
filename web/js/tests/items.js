define(['utils/testsAPI'], function(testsAPI) {
    
    function Test(){

        

        describe('inventory', function() {

            before(testsAPI.Prepare);

            afterEach(testsAPI.AfterEach);

            after(testsAPI.Logout);

            it('should successfully pick up item', function(done) {
                var player = { x: 0.5, y: 0.5 };
                var item_id = null;

                testsAPI.SetWSHandler(function(e) {

                   var response = JSON.parse(e.data);

                    if (response['action'] == testsAPI.startTestingAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.SetUpConstants();
                        testsAPI.SetUpMap([
                            [".", ".", ".", "."],
                            [".", ".", ".", "."],
                            [".", ".", ".", "."],
                            [".", ".", ".", "."]
                        ]);
                    } else if (response['action'] == testsAPI.setUpConstAction) {
                        testsAPI.Ok(response['result']);
                    } else if (response['action'] == testsAPI.setUpMapAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.PutPlayer(player['x'], player['y']);
                    } else if (response['action'] == testsAPI.putPlayerAction) {
                        testsAPI.Ok(response['result']);
                        player['id'] = response['id'];
                        player['sid'] = response['sid'];
                        testsAPI.PutItem(player['x'] + 1, player['y'] + 1);
                    } else if (response['action'] == testsAPI.putItemAction) {
                        testsAPI.Ok(response['result']);
                        item_id = response['id'];
                        testsAPI.PickUp(player['sid'], item_id);
                    } else if (response['action'] == testsAPI.enforceAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.Ok(response['actionResult']['result']);
                        done();
                    }
                });

                testsAPI.StartTesting();
            });

            it('should fail pick up item[too far]', function(done) {
                var player = { x: 0.5, y: 0.5 };
                var item_id = null;

                testsAPI.SetWSHandler(function(e) {

                   var response = JSON.parse(e.data);

                    if (response['action'] == testsAPI.startTestingAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.SetUpConstants();
                        testsAPI.SetUpMap([
                            [".", ".", ".", ".", ".", ".", ".", "."],
                            [".", ".", ".", ".", ".", ".", ".", "."],
                            [".", ".", ".", ".", ".", ".", ".", "."],
                            [".", ".", ".", ".", ".", ".", ".", "."],
                            [".", ".", ".", ".", ".", ".", ".", "."],
                            [".", ".", ".", ".", ".", ".", ".", "."],
                            [".", ".", ".", ".", ".", ".", ".", "."],
                        ]);
                    } else if (response['action'] == testsAPI.setUpConstAction) {
                        testsAPI.Ok(response['result']);
                    } else if (response['action'] == testsAPI.setUpMapAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.PutPlayer(player['x'], player['y']);
                    } else if (response['action'] == testsAPI.putPlayerAction) {
                        testsAPI.Ok(response['result']);
                        player['id'] = response['id'];
                        player['sid'] = response['sid'];
                        testsAPI.PutItem(player['x'] + testsAPI.pickUpRadius + 1, player['y'] + testsAPI.pickUpRadius + 1);
                    } else if (response['action'] == testsAPI.putItemAction) {
                        testsAPI.Ok(response['result']);
                        item_id = response['id'];
                        testsAPI.PickUp(player['sid'], item_id);
                    } else if (response['action'] == testsAPI.enforceAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.Equal(response['actionResult']['result'], testsAPI.actionResultBadId);
                        done();
                    }
                });

                testsAPI.StartTesting();
            });

            it('should fail pick up item[player already has it in inventory]', function(done) {
                var player = { x: 0.5, y: 0.5 };
                var item_id = null;

                testsAPI.SetWSHandler(function(e) {

                   var response = JSON.parse(e.data);

                    if (response['action'] == testsAPI.startTestingAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.SetUpConstants();
                        testsAPI.SetUpMap([
                            [".", ".", ".", "."],
                            [".", ".", ".", "."],
                            [".", ".", ".", "."],
                            [".", ".", ".", "."]
                        ]);
                    } else if (response['action'] == testsAPI.setUpConstAction) {
                        testsAPI.Ok(response['result']);
                    } else if (response['action'] == testsAPI.setUpMapAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.PutPlayer(player['x'], player['y'], [ testsAPI.MakeItem() ]);
                    } else if (response['action'] == testsAPI.putPlayerAction) {
                        testsAPI.Ok(response['result']);
                        player['id'] = response['id'];
                        player['sid'] = response['sid'];
                        item_id = response['inventory'][0];
                        testsAPI.PickUp(player['sid'], item_id)
                    } else if (response['action'] == testsAPI.enforceAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.Equal(response['actionResult']['result'], testsAPI.actionResultBadId);
                        done();
                    }
                });

                testsAPI.StartTesting();
            });

            it('should fail pick up item[object doesn\'t exists]', function(done) {
                var player = { x: 0.5, y: 0.5 };

                testsAPI.SetWSHandler(function(e) {

                   var response = JSON.parse(e.data);

                    if (response['action'] == testsAPI.startTestingAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.SetUpConstants();
                        testsAPI.SetUpMap([
                            [".", ".", ".", "."],
                            [".", ".", ".", "."],
                            [".", ".", ".", "."],
                            [".", ".", ".", "."]
                        ]);
                    } else if (response['action'] == testsAPI.setUpConstAction) {
                        testsAPI.Ok(response['result']);
                    } else if (response['action'] == testsAPI.setUpMapAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.PutPlayer(player['x'], player['y']);
                    } else if (response['action'] == testsAPI.putPlayerAction) {
                        testsAPI.Ok(response['result']);
                        player['sid'] = response['sid'];
                        testsAPI.PickUp(player['sid'], 34535345)
                    } else if (response['action'] == testsAPI.enforceAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.Equal(response['actionResult']['result'], testsAPI.actionResultBadId);
                        done();
                    }
                });

                testsAPI.StartTesting();
            });

            it('should successfully destroy item', function(done) {
                var player = { x: 0.5, y: 0.5 };
                var item_id = null;

                testsAPI.SetWSHandler(function(e) {

                   var response = JSON.parse(e.data);

                    if (response['action'] == testsAPI.startTestingAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.SetUpConstants();
                        testsAPI.SetUpMap([
                            [".", ".", ".", "."],
                            [".", ".", ".", "."],
                            [".", ".", ".", "."],
                            [".", ".", ".", "."]
                        ]);
                    } else if (response['action'] == testsAPI.setUpConstAction) {
                        testsAPI.Ok(response['result']);
                    } else if (response['action'] == testsAPI.setUpMapAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.PutPlayer(player['x'], player['y']);
                    } else if (response['action'] == testsAPI.putPlayerAction) {
                        testsAPI.Ok(response['result']);
                        player['id'] = response['id'];
                        player['sid'] = response['sid'];
                        testsAPI.PutItem(player['x'] + 1, player['y'] + 1);
                    } else if (response['action'] == testsAPI.putItemAction) {
                        testsAPI.Ok(response['result']);
                        item_id = response['id'];
                        testsAPI.Destroy(player['sid'], item_id);
                    } else if (response['action'] == testsAPI.enforceAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.Ok(response['actionResult']['result']);
                        testsAPI.Sleep(testsAPI.tickDuration * 3, testsAPI.Examine, item_id);
                    } else if (response['action'] == testsAPI.examineAction) {
                        testsAPI.Equal(response['result'], testsAPI.actionResultBadId);
                        done();
                    }
                });

                testsAPI.StartTesting();
            });

            it('should successfully destroy item in inventory', function(done) {
                var player = { x: 0.5, y: 0.5 };
                var item_id = null;

                testsAPI.SetWSHandler(function(e) {

                   var response = JSON.parse(e.data);

                    if (response['action'] == testsAPI.startTestingAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.SetUpConstants();
                        testsAPI.SetUpMap([
                            [".", ".", ".", "."],
                            [".", ".", ".", "."],
                            [".", ".", ".", "."],
                            [".", ".", ".", "."]
                        ]);
                    } else if (response['action'] == testsAPI.setUpConstAction) {
                        testsAPI.Ok(response['result']);
                    } else if (response['action'] == testsAPI.setUpMapAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.PutPlayer(player['x'], player['y'], [ testsAPI.MakeItem() ]);
                    } else if (response['action'] == testsAPI.putPlayerAction) {
                        testsAPI.Ok(response['result']);
                        player['id'] = response['id'];
                        player['sid'] = response['sid'];
                        item_id = response['inventory'][0];
                        testsAPI.Destroy(player['sid'], item_id)
                    } else if (response['action'] == testsAPI.enforceAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.Ok(response['actionResult']['result']);
                        done();
                    }
                });

                testsAPI.StartTesting();
            });

            it('should fail destroy item[object doesn\'t exists]', function(done) {
                var player = { x: 0.5, y: 0.5 };

                testsAPI.SetWSHandler(function(e) {

                   var response = JSON.parse(e.data);

                    if (response['action'] == testsAPI.startTestingAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.SetUpConstants();
                        testsAPI.SetUpMap([
                            [".", ".", ".", "."],
                            [".", ".", ".", "."],
                            [".", ".", ".", "."],
                            [".", ".", ".", "."]
                        ]);
                    } else if (response['action'] == testsAPI.setUpConstAction) {
                        testsAPI.Ok(response['result']);
                    } else if (response['action'] == testsAPI.setUpMapAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.PutPlayer(player['x'], player['y']);
                    } else if (response['action'] == testsAPI.putPlayerAction) {
                        testsAPI.Ok(response['result']);
                        player['sid'] = response['sid'];
                        testsAPI.Destroy(player['sid'], -1)
                    } else if (response['action'] == testsAPI.enforceAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.Equal(response['actionResult']['result'], testsAPI.actionResultBadId);
                        done();
                    }
                });

                testsAPI.StartTesting();
            });

            it('should fail destroy item[too far]', function(done) {
                var player = { x: 0.5, y: 0.5 };
                var item_id = null;

                testsAPI.SetWSHandler(function(e) {

                   var response = JSON.parse(e.data);

                    if (response['action'] == testsAPI.startTestingAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.SetUpConstants();
                        testsAPI.SetUpMap([
                            [".", ".", ".", ".", ".", ".", ".", "."],
                            [".", ".", ".", ".", ".", ".", ".", "."],
                            [".", ".", ".", ".", ".", ".", ".", "."],
                            [".", ".", ".", ".", ".", ".", ".", "."],
                            [".", ".", ".", ".", ".", ".", ".", "."],
                            [".", ".", ".", ".", ".", ".", ".", "."],
                            [".", ".", ".", ".", ".", ".", ".", "."],
                        ]);
                    } else if (response['action'] == testsAPI.setUpConstAction) {
                        testsAPI.Ok(response['result']);
                    } else if (response['action'] == testsAPI.setUpMapAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.PutPlayer(player['x'], player['y']);
                    } else if (response['action'] == testsAPI.putPlayerAction) {
                        testsAPI.Ok(response['result']);
                        player['id'] = response['id'];
                        player['sid'] = response['sid'];
                        testsAPI.PutItem(player['x'] + testsAPI.pickUpRadius + 1, player['y'] + testsAPI.pickUpRadius + 1);
                    } else if (response['action'] == testsAPI.putItemAction) {
                        testsAPI.Ok(response['result']);
                        item_id = response['id'];
                        testsAPI.Destroy(player['sid'], item_id);
                    } else if (response['action'] == testsAPI.enforceAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.Equal(response['actionResult']['result'], testsAPI.actionResultBadId);
                        testsAPI.Sleep(testsAPI.tickDuration * 3, testsAPI.Examine, item_id);
                    } else if (response['action'] == testsAPI.examineAction) {
                        testsAPI.Ok(response['result']);
                        done();
                    }
                });

                testsAPI.StartTesting();
            });

            it('should successfully drop item', function(done) {
                var player = { x: 0.5, y: 0.5 };
                var item_id = null;

                testsAPI.SetWSHandler(function(e) {

                   var response = JSON.parse(e.data);

                    if (response['action'] == testsAPI.startTestingAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.SetUpConstants();
                        testsAPI.SetUpMap([
                            [".", ".", ".", "."],
                            [".", ".", ".", "."],
                            [".", ".", ".", "."],
                            [".", ".", ".", "."]
                        ]);
                    } else if (response['action'] == testsAPI.setUpConstAction) {
                        testsAPI.Ok(response['result']);
                    } else if (response['action'] == testsAPI.setUpMapAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.PutPlayer(player['x'], player['y'], [ testsAPI.MakeItem() ]);
                    } else if (response['action'] == testsAPI.putPlayerAction) {
                        testsAPI.Ok(response['result']);
                        player['id'] = response['id'];
                        player['sid'] = response['sid'];
                        item_id = response['inventory'][0];
                        testsAPI.Drop(player['sid'], item_id)
                    } else if (response['action'] == testsAPI.enforceAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.Ok(response['actionResult']['result']);
                        done();
                    }
                });

                testsAPI.StartTesting();
            });

            it('should fail drop item[player hasn\'t it in inventory]', function(done) {
                var player = { x: 0.5, y: 0.5 };
                var item_id = null;

                testsAPI.SetWSHandler(function(e) {

                   var response = JSON.parse(e.data);

                    if (response['action'] == testsAPI.startTestingAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.SetUpConstants();
                        testsAPI.SetUpMap([
                            [".", ".", ".", ".", ".", ".", ".", "."],
                            [".", ".", ".", ".", ".", ".", ".", "."],
                            [".", ".", ".", ".", ".", ".", ".", "."],
                            [".", ".", ".", ".", ".", ".", ".", "."],
                            [".", ".", ".", ".", ".", ".", ".", "."],
                            [".", ".", ".", ".", ".", ".", ".", "."],
                            [".", ".", ".", ".", ".", ".", ".", "."]
                        ]);
                    } else if (response['action'] == testsAPI.setUpConstAction) {
                        testsAPI.Ok(response['result']);
                    } else if (response['action'] == testsAPI.setUpMapAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.PutPlayer(player['x'], player['y']);
                    } else if (response['action'] == testsAPI.putPlayerAction) {
                        testsAPI.Ok(response['result']);
                        player['id'] = response['id'];
                        player['sid'] = response['sid'];
                        testsAPI.PutItem(player['x'] + 1, player['y'] + 1);
                    } else if (response['action'] == testsAPI.putItemAction) {
                        testsAPI.Ok(response['result']);
                        item_id = response['id'];
                        testsAPI.Drop(player['sid'], item_id);
                    } else if (response['action'] == testsAPI.enforceAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.Equal(response['actionResult']['result'], testsAPI.actionResultBadId);
                        done();
                    }
                });

                testsAPI.StartTesting();
            });

            it('should fail drop item[object doesn\'t exists]', function(done) {
                var player = { x: 0.5, y: 0.5 };

                testsAPI.SetWSHandler(function(e) {

                   var response = JSON.parse(e.data);

                    if (response['action'] == testsAPI.startTestingAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.SetUpConstants();
                        testsAPI.SetUpMap([
                            [".", ".", ".", "."],
                            [".", ".", ".", "."],
                            [".", ".", ".", "."],
                            [".", ".", ".", "."]
                        ]);
                    } else if (response['action'] == testsAPI.setUpConstAction) {
                        testsAPI.Ok(response['result']);
                    } else if (response['action'] == testsAPI.setUpMapAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.PutPlayer(player['x'], player['y']);
                    } else if (response['action'] == testsAPI.putPlayerAction) {
                        testsAPI.Ok(response['result']);
                        player['sid'] = response['sid'];
                        testsAPI.Drop(player['sid'], -1)
                    } else if (response['action'] == testsAPI.enforceAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.Equal(response['actionResult']['result'], testsAPI.actionResultBadId);
                        done();
                    }
                });

                testsAPI.StartTesting();
            });

            it('should fail pick up item[item in other player\'s inventory]', function(done) {
                var player1 = { x: 0.5, y: 0.5 };
                var player2 = { x: 1.5, y: 1.5 };
                var item_id = null;
                var firstPut = true;

                testsAPI.SetWSHandler(function(e) {

                   var response = JSON.parse(e.data);

                    if (response['action'] == testsAPI.startTestingAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.SetUpConstants();
                        testsAPI.SetUpMap([
                            [".", ".", ".", ".", ".", ".", ".", "."],
                            [".", ".", ".", ".", ".", ".", ".", "."],
                            [".", ".", ".", ".", ".", ".", ".", "."],
                            [".", ".", ".", ".", ".", ".", ".", "."],
                            [".", ".", ".", ".", ".", ".", ".", "."],
                            [".", ".", ".", ".", ".", ".", ".", "."],
                            [".", ".", ".", ".", ".", ".", ".", "."]
                        ]);
                    } else if (response['action'] == testsAPI.setUpConstAction) {
                        testsAPI.Ok(response['result']);
                    } else if (response['action'] == testsAPI.setUpMapAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.PutPlayer(player1['x'], player1['y'], [ testsAPI.MakeItem() ]);
                        testsAPI.PutPlayer(player2['x'], player2['y']);
                    } else if (response['action'] == testsAPI.putPlayerAction) {
                        testsAPI.Ok(response['result']);
                        if (firstPut) {
                            firstPut = false;
                            player1['id'] = response['id'];
                            player1['sid'] = response['sid'];
                            item_id = response['inventory'][0];    
                        } else {
                            player2['sid'] = response['sid'];
                            testsAPI.PickUp(player2['sid'], item_id);
                        }
                    } else if (response['action'] == testsAPI.enforceAction) {
                        testsAPI.Ok(response['result']);
                        if (response['actionResult']['action'] == testsAPI.pickUpAction) {
                            testsAPI.Equal(response['actionResult']['result'], testsAPI.actionResultBadId);
                            testsAPI.Examine(player1['id'], player1['sid']);
                        } else {
                            testsAPI.Equal(response['actionResult']['inventory'][0]['id'], item_id);
                            done();
                        }
                    }
                });

                testsAPI.StartTesting();
            });

            it('should fail destroy item[item in other player\'s inventory]', function(done) {
                var player1 = { x: 0.5, y: 0.5 };
                var player2 = { x: 1.5, y: 1.5 };
                var item_id = null;
                var firstPut = true;

                testsAPI.SetWSHandler(function(e) {

                   var response = JSON.parse(e.data);

                    if (response['action'] == testsAPI.startTestingAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.SetUpConstants();
                        testsAPI.SetUpMap([
                            [".", ".", ".", ".", ".", ".", ".", "."],
                            [".", ".", ".", ".", ".", ".", ".", "."],
                            [".", ".", ".", ".", ".", ".", ".", "."],
                            [".", ".", ".", ".", ".", ".", ".", "."],
                            [".", ".", ".", ".", ".", ".", ".", "."],
                            [".", ".", ".", ".", ".", ".", ".", "."],
                            [".", ".", ".", ".", ".", ".", ".", "."]
                        ]);
                    } else if (response['action'] == testsAPI.setUpConstAction) {
                        testsAPI.Ok(response['result']);
                    } else if (response['action'] == testsAPI.setUpMapAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.PutPlayer(player1['x'], player1['y'], [ testsAPI.MakeItem() ]);
                        testsAPI.PutPlayer(player2['x'], player2['y']);
                    } else if (response['action'] == testsAPI.putPlayerAction) {
                        testsAPI.Ok(response['result']);
                        if (firstPut) {
                            firstPut = false;
                            player1['id'] = response['id'];
                            player1['sid'] = response['sid'];
                            item_id = response['inventory'][0];    
                        } else {
                            player2['sid'] = response['sid'];
                            testsAPI.Destroy(player2['sid'], item_id);
                        }
                    } else if (response['action'] == testsAPI.enforceAction) {
                        testsAPI.Ok(response['result']);
                        if (response['actionResult']['action'] == testsAPI.destroyAction) {
                            testsAPI.Equal(response['actionResult']['result'], testsAPI.actionResultBadId);
                            testsAPI.Examine(player1['id'], player1['sid']);
                        } else {
                            testsAPI.Equal(response['actionResult']['inventory'][0]['id'], item_id);
                            done();
                        }
                    }
                });

                testsAPI.StartTesting();
            });

            it('should fail drop item[item in other player\'s inventory]', function(done) {
                var player1 = { x: 0.5, y: 0.5 };
                var player2 = { x: 1.5, y: 1.5 };
                var item_id = null;
                var firstPut = true;

                testsAPI.SetWSHandler(function(e) {

                   var response = JSON.parse(e.data);

                    if (response['action'] == testsAPI.startTestingAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.SetUpConstants();
                        testsAPI.SetUpMap([
                            [".", ".", ".", ".", ".", ".", ".", "."],
                            [".", ".", ".", ".", ".", ".", ".", "."],
                            [".", ".", ".", ".", ".", ".", ".", "."],
                            [".", ".", ".", ".", ".", ".", ".", "."],
                            [".", ".", ".", ".", ".", ".", ".", "."],
                            [".", ".", ".", ".", ".", ".", ".", "."],
                            [".", ".", ".", ".", ".", ".", ".", "."]
                        ]);
                    } else if (response['action'] == testsAPI.setUpConstAction) {
                        testsAPI.Ok(response['result']);
                    } else if (response['action'] == testsAPI.setUpMapAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.PutPlayer(player1['x'], player1['y'], [ testsAPI.MakeItem() ]);
                        testsAPI.PutPlayer(player2['x'], player2['y']);
                    } else if (response['action'] == testsAPI.putPlayerAction) {
                        testsAPI.Ok(response['result']);
                        if (firstPut) {
                            firstPut = false;
                            player1['id'] = response['id'];
                            player1['sid'] = response['sid'];
                            item_id = response['inventory'][0];    
                        } else {
                            player2['sid'] = response['sid'];
                            testsAPI.Drop(player2['sid'], item_id);
                        }
                    } else if (response['action'] == testsAPI.enforceAction) {
                        testsAPI.Ok(response['result']);
                        if (response['actionResult']['action'] == testsAPI.dropAction) {
                            testsAPI.Equal(response['actionResult']['result'], testsAPI.actionResultBadId);
                            testsAPI.Examine(player1['id'], player1['sid']);
                        } else {
                            testsAPI.Equal(response['actionResult']['inventory'][0]['id'], item_id);
                            done();
                        }
                    }
                });

                testsAPI.StartTesting();
            });

            it('should fail pick up item[too heavy]', function(done) {
                var player = { x: 0.5, y: 0.5 };
                var item_id = null;

                testsAPI.SetWSHandler(function(e) {

                   var response = JSON.parse(e.data);

                    if (response['action'] == testsAPI.startTestingAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.SetUpConstants();
                        testsAPI.SetUpMap([
                            [".", ".", ".", "."],
                            [".", ".", ".", "."],
                            [".", ".", ".", "."],
                            [".", ".", ".", "."]
                        ]);
                    } else if (response['action'] == testsAPI.setUpConstAction) {
                        testsAPI.Ok(response['result']);
                    } else if (response['action'] == testsAPI.setUpMapAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.PutPlayer(player['x'], player['y'], [], { STRENGTH : 1 });
                    } else if (response['action'] == testsAPI.putPlayerAction) {
                        testsAPI.Ok(response['result']);
                        player['id'] = response['id'];
                        player['sid'] = response['sid'];
                        testsAPI.PutItem(player['x'] + 1, player['y'] + 1, 1000);
                    } else if (response['action'] == testsAPI.putItemAction) {
                        testsAPI.Ok(response['result']);
                        item_id = response['id'];
                        testsAPI.PickUp(player['sid'], item_id);
                    } else if (response['action'] == testsAPI.enforceAction) {
                        testsAPI.Ok(response['result']);
                        if (response['actionResult']['action'] == testsAPI.pickUpAction) {
                            testsAPI.Equal(response['actionResult']['result'], 'tooHeavy');
                            testsAPI.Examine(player['id'], player['sid']);    
                        } else {
                            testsAPI.Equal(response['actionResult']['inventory'].length, 0);
                            done();
                        }                        
                    }
                });

                testsAPI.StartTesting();
            });

            it('should successfully equip item', function(done) {
                var player = { x: 0.5, y: 0.5 };
                var item_id = null;

                testsAPI.SetWSHandler(function(e) {

                   var response = JSON.parse(e.data);

                    if (response['action'] == testsAPI.startTestingAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.SetUpConstants();
                        testsAPI.SetUpMap([
                            [".", ".", ".", "."],
                            [".", ".", ".", "."],
                            [".", ".", ".", "."],
                            [".", ".", ".", "."]
                        ]);
                    } else if (response['action'] == testsAPI.setUpConstAction) {
                        testsAPI.Ok(response['result']);
                    } else if (response['action'] == testsAPI.setUpMapAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.PutPlayer(player['x'], player['y'], [ testsAPI.MakeItem() ]);
                    } else if (response['action'] == testsAPI.putPlayerAction) {
                        testsAPI.Ok(response['result']);
                        player['id'] = response['id'];
                        player['sid'] = response['sid'];
                        item_id = response['inventory'][0];
                        testsAPI.Equip(player['sid'], item_id, "LEFT-HAND");
                    } else if (response['action'] == testsAPI.enforceAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.Ok(response['actionResult']['result']);
                        if (response['actionResult']['action'] == testsAPI.equipAction) {
                            testsAPI.Examine(player['id'], player['sid']);
                        } else {
                            testsAPI.Equal(response['actionResult']['slots']['LEFT-HAND']['id'], item_id);
                            done();
                        }
                    }
                });

                testsAPI.StartTesting();
            });

            it('should successfully unequip item', function(done) {
                var player = { x: 0.5, y: 0.5 };
                var item_id = null;

                testsAPI.SetWSHandler(function(e) {

                   var response = JSON.parse(e.data);

                    if (response['action'] == testsAPI.startTestingAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.SetUpConstants();
                        testsAPI.SetUpMap([
                            [".", ".", ".", "."],
                            [".", ".", ".", "."],
                            [".", ".", ".", "."],
                            [".", ".", ".", "."]
                        ]);
                    } else if (response['action'] == testsAPI.setUpConstAction) {
                        testsAPI.Ok(response['result']);
                    } else if (response['action'] == testsAPI.setUpMapAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.PutPlayer(player['x'], player['y'], [ testsAPI.MakeItem() ], {}, { 'LEFT-HAND' : testsAPI.MakeItem() });
                    } else if (response['action'] == testsAPI.putPlayerAction) {
                        testsAPI.Ok(response['result']);
                        player['id'] = response['id'];
                        player['sid'] = response['sid'];
                        item_id = response['inventory'][0];
                        testsAPI.Unequip(player['sid'], "LEFT-HAND");
                    } else if (response['action'] == testsAPI.enforceAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.Ok(response['actionResult']['result']);
                        if (response['actionResult']['action'] == testsAPI.unequipAction) {
                            testsAPI.Examine(player['id'], player['sid']);
                        } else {
                            testsAPI.Equal(response['actionResult']['slots']['LEFT-HAND'], undefined);
                            done();
                        }
                    }
                });

                testsAPI.StartTesting();
            });

            it('should successfully equip/unequip item', function(done) {
                var player = { x: 0.5, y: 0.5 };
                var item_id = null;
                var first = true;

                testsAPI.SetWSHandler(function(e) {

                   var response = JSON.parse(e.data);

                    if (response['action'] == testsAPI.startTestingAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.SetUpConstants();
                        testsAPI.SetUpMap([
                            [".", ".", ".", "."],
                            [".", ".", ".", "."],
                            [".", ".", ".", "."],
                            [".", ".", ".", "."]
                        ]);
                    } else if (response['action'] == testsAPI.setUpConstAction) {
                        testsAPI.Ok(response['result']);
                    } else if (response['action'] == testsAPI.setUpMapAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.PutPlayer(player['x'], player['y'], [ testsAPI.MakeItem() ]);
                    } else if (response['action'] == testsAPI.putPlayerAction) {
                        testsAPI.Ok(response['result']);
                        player['id'] = response['id'];
                        player['sid'] = response['sid'];
                        item_id = response['inventory'][0];
                        testsAPI.Equip(player['sid'], item_id, "LEFT-HAND");
                    } else if (response['action'] == testsAPI.enforceAction) {
                        testsAPI.Ok(response['result']);
                        testsAPI.Ok(response['actionResult']['result']);
                        if (response['actionResult']['action'] == testsAPI.equipAction) {
                            testsAPI.Examine(player['id'], player['sid']);
                        } else if (response['actionResult']['action'] == testsAPI.examineAction) {
                            if (first) {
                                first = false;
                                testsAPI.Equal(response['actionResult']['slots']['LEFT-HAND']['id'], item_id);
                                testsAPI.Unequip(player['sid'], 'LEFT-HAND');
                            } else {
                                testsAPI.Equal(response['actionResult']['slots']['LEFT-HAND'], undefined);
                                done();
                            }
                        } else if (response['actionResult']['action'] == testsAPI.unequipAction) {
                            testsAPI.Ok(response['actionResult']['result']);
                            testsAPI.Examine(player['id'], player['sid']);
                        }
                    }
                });

                testsAPI.StartTesting();
            });

        });

        
    }


    return {
      Test: Test
    }
});