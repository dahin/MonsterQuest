define(['utils/testsAPI'], function(testsAPI) {

    function Test(){

        describe('Inventory', function() {

            before(testsAPI.Prepare);

            beforeEach(testsAPI.BeforeEach);

            afterEach(testsAPI.AfterEach);

            after(testsAPI.Logout);

            describe('Pick up, drop, destroy, equip, unequip', function(done) {

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
                        } else if (response['action'] == testsAPI.pickUpAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.Examine(player['id'], player['sid']);
                        } else if (response['action'] == testsAPI.examineAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.Equal(response['inventory'][0].id, item_id);
                            done();
                        }
                    });

                });

                it('should fail pick up item[too far]', function(done) {
                    var player = { x: 0.5, y: 0.5 };
                    var item_id = null;

                    testsAPI.SetWSHandler(function(e) {

                       var response = JSON.parse(e.data);

                        if (response['action'] == testsAPI.startTestingAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.SetUpConstants();
                        } else if (response['action'] == testsAPI.setUpConstAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.SetUpMap([
                                [".", ".", ".", ".", ".", ".", ".", "."],
                                [".", ".", ".", ".", ".", ".", ".", "."],
                                [".", ".", ".", ".", ".", ".", ".", "."],
                                [".", ".", ".", ".", ".", ".", ".", "."],
                                [".", ".", ".", ".", ".", ".", ".", "."],
                                [".", ".", ".", ".", ".", ".", ".", "."],
                                [".", ".", ".", ".", ".", ".", ".", "."],
                            ]);
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
                        } else if (response['action'] == testsAPI.pickUpAction) {
                            testsAPI.Equal(response['result'], testsAPI.actionResultBadId);
                            testsAPI.Examine(player['id'], player['sid']);
                        } else if (response['action'] == testsAPI.examineAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.Equal(response['inventory'] == null || response['inventory'].length == 0, true);
                            done();
                        }
                    });

                });

                it('should fail pick up item[player already has it in inventory]', function(done) {
                    var player = { x: 0.5, y: 0.5 };
                    var item_id = null;

                    testsAPI.SetWSHandler(function(e) {

                       var response = JSON.parse(e.data);

                        if (response['action'] == testsAPI.startTestingAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.SetUpConstants();
                        } else if (response['action'] == testsAPI.setUpConstAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.SetUpMap([
                                [".", ".", ".", "."],
                                [".", ".", ".", "."],
                                [".", ".", ".", "."],
                                [".", ".", ".", "."]
                            ]);
                        } else if (response['action'] == testsAPI.setUpMapAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.PutPlayer(player['x'], player['y'], [ testsAPI.MakeItem() ]);
                        } else if (response['action'] == testsAPI.putPlayerAction) {
                            testsAPI.Ok(response['result']);
                            player['id'] = response['id'];
                            player['sid'] = response['sid'];
                            item_id = response['inventory'][0].id;
                            testsAPI.PickUp(player['sid'], item_id)
                        } else if (response['action'] == testsAPI.pickUpAction) {
                            testsAPI.Equal(response['result'], testsAPI.actionResultBadId);
                            testsAPI.Examine(player['id'], player['sid']);
                        } else if (response['action'] == testsAPI.examineAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.Equal(response['inventory'][0].id, item_id);
                            done();
                        }
                    });

                });

                it('should fail pick up item[object doesn\'t exists]', function(done) {
                    var player = { x: 0.5, y: 0.5 };

                    testsAPI.SetWSHandler(function(e) {

                       var response = JSON.parse(e.data);

                        if (response['action'] == testsAPI.startTestingAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.SetUpConstants();
                        } else if (response['action'] == testsAPI.setUpConstAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.SetUpMap([
                                [".", ".", ".", "."],
                                [".", ".", ".", "."],
                                [".", ".", ".", "."],
                                [".", ".", ".", "."]
                            ]);
                        } else if (response['action'] == testsAPI.setUpMapAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.PutPlayer(player['x'], player['y']);
                        } else if (response['action'] == testsAPI.putPlayerAction) {
                            testsAPI.Ok(response['result']);
                            player['sid'] = response['sid'];
                            player['id']  = response['id']
                            testsAPI.PickUp(player['sid'], 34535345)
                        } else if (response['action'] == testsAPI.pickUpAction) {
                            testsAPI.Equal(response['result'], testsAPI.actionResultBadId);
                            testsAPI.Examine(player['id'], player['sid']);
                        } else if (response['action'] == testsAPI.examineAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.Equal(response['inventory'] == null || response['inventory'].length == 0, true);
                            done();
                        }
                    });

                });

                it('should successfully destroy item', function(done) {
                    var player = { x: 0.5, y: 0.5 };
                    var item_id = null;

                    testsAPI.SetWSHandler(function(e) {

                       var response = JSON.parse(e.data);

                        if (response['action'] == testsAPI.startTestingAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.SetUpConstants();
                        } else if (response['action'] == testsAPI.setUpConstAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.SetUpMap([
                                [".", ".", ".", "."],
                                [".", ".", ".", "."],
                                [".", ".", ".", "."],
                                [".", ".", ".", "."]
                            ]);
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
                        } else if (response['action'] == testsAPI.destroyAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.Examine(item_id);
                        } else if (response['action'] == testsAPI.examineAction) {
                            testsAPI.Equal(response['result'], testsAPI.actionResultBadId);
                            done();
                        }
                    });

                });

                it('should successfully destroy item in inventory', function(done) {
                    var player = { x: 0.5, y: 0.5 };
                    var item_id = null;

                    testsAPI.SetWSHandler(function(e) {

                       var response = JSON.parse(e.data);

                        if (response['action'] == testsAPI.startTestingAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.SetUpConstants();
                        } else if (response['action'] == testsAPI.setUpConstAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.SetUpMap([
                                [".", ".", ".", "."],
                                [".", ".", ".", "."],
                                [".", ".", ".", "."],
                                [".", ".", ".", "."]
                            ]);
                        } else if (response['action'] == testsAPI.setUpMapAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.PutPlayer(player['x'], player['y'], [ testsAPI.MakeItem() ]);
                        } else if (response['action'] == testsAPI.putPlayerAction) {
                            testsAPI.Ok(response['result']);
                            player['id'] = response['id'];
                            player['sid'] = response['sid'];
                            item_id = response['inventory'][0].id;
                            testsAPI.Destroy(player['sid'], item_id)
                        } else if (response['action'] == testsAPI.destroyAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.Examine(item_id);
                        } else if (response['action'] == testsAPI.examineAction) {
                            testsAPI.Equal(response['result'], testsAPI.actionResultBadId);
                            done();
                        }
                    });

                });

                it('should fail destroy item[object doesn\'t exists]', function(done) {
                    var player = { x: 0.5, y: 0.5 };

                    testsAPI.SetWSHandler(function(e) {

                       var response = JSON.parse(e.data);

                        if (response['action'] == testsAPI.startTestingAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.SetUpConstants();
                        } else if (response['action'] == testsAPI.setUpConstAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.SetUpMap([
                                [".", ".", ".", "."],
                                [".", ".", ".", "."],
                                [".", ".", ".", "."],
                                [".", ".", ".", "."]
                            ]);
                        } else if (response['action'] == testsAPI.setUpMapAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.PutPlayer(player['x'], player['y']);
                        } else if (response['action'] == testsAPI.putPlayerAction) {
                            testsAPI.Ok(response['result']);
                            player['sid'] = response['sid'];
                            testsAPI.Destroy(player['sid'], -1)
                        } else if (response['action'] == testsAPI.destroyAction) {
                            testsAPI.Equal(response['result'], testsAPI.actionResultBadId);
                            done();
                        }
                    });

                });

                it('should fail destroy item[too far]', function(done) {
                    var player = { x: 0.5, y: 0.5 };
                    var item_id = null;

                    testsAPI.SetWSHandler(function(e) {

                       var response = JSON.parse(e.data);

                        if (response['action'] == testsAPI.startTestingAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.SetUpConstants();
                        } else if (response['action'] == testsAPI.setUpConstAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.SetUpMap([
                                [".", ".", ".", ".", ".", ".", ".", "."],
                                [".", ".", ".", ".", ".", ".", ".", "."],
                                [".", ".", ".", ".", ".", ".", ".", "."],
                                [".", ".", ".", ".", ".", ".", ".", "."],
                                [".", ".", ".", ".", ".", ".", ".", "."],
                                [".", ".", ".", ".", ".", ".", ".", "."],
                                [".", ".", ".", ".", ".", ".", ".", "."],
                            ]);
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
                        } else if (response['action'] == testsAPI.destroyAction) {
                            testsAPI.Equal(response['result'], testsAPI.actionResultBadId);
                            testsAPI.Examine(item_id);
                        } else if (response['action'] == testsAPI.examineAction) {
                            testsAPI.Ok(response['result']);
                            done();
                        }
                    });

                });

                it('should fail destroy player fist item[default weapon]', function(done) {
                    var player = { x: 0.5, y: 0.5 };

                    testsAPI.SetWSHandler(function(e) {

                       var response = JSON.parse(e.data);

                        if (response['action'] == testsAPI.startTestingAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.SetUpConstants();
                        } else if (response['action'] == testsAPI.setUpConstAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.SetUpMap([
                                [".", ".", ".", "."],
                                [".", ".", ".", "."],
                                [".", ".", ".", "."],
                                [".", ".", ".", "."]
                            ]);
                        } else if (response['action'] == testsAPI.setUpMapAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.PutPlayer(player['x'], player['y']);
                        } else if (response['action'] == testsAPI.putPlayerAction) {
                            testsAPI.Ok(response['result']);
                            player.sid = response['sid'];
                            player.fist_id = response['fist_id'];
                            testsAPI.Destroy(player.sid, player.fist_id);
                        } else if (response['action'] == testsAPI.destroyAction) {
                            testsAPI.Equal(response['result'], testsAPI.actionResultBadId);
                            done();
                        }
                    });

                });

                it('should successfully drop item', function(done) {
                    var player = { x: 0.5, y: 0.5 };
                    var item_id = null;
                    var self_examine = false;
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
                            item_id = response['inventory'][0].id;
                            testsAPI.Drop(player['sid'], item_id)
                        } else if (response['action'] == testsAPI.dropAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.Examine(item_id);
                        } else if (response['action'] == testsAPI.examineAction) {
                            testsAPI.Ok(response['result']);
                            if (!self_examine){
                                self_examine = true;
                                testsAPI.Examine(player['id'], player['sid']);
                            } else {
                                testsAPI.Equal(response['inventory'].length, 0);
                                done();
                            }
                        }
                    });

                });

                it('should fail drop item[player hasn\'t it in inventory]', function(done) {
                    var player = { x: 0.5, y: 0.5 };
                    var item_id = null;
                    var self_examine = false;
                    testsAPI.SetWSHandler(function(e) {

                       var response = JSON.parse(e.data);

                        if (response['action'] == testsAPI.startTestingAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.SetUpConstants();
                            
                        } else if (response['action'] == testsAPI.setUpConstAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.SetUpMap([
                                [".", ".", ".", ".", ".", ".", ".", "."],
                                [".", ".", ".", ".", ".", ".", ".", "."],
                                [".", ".", ".", ".", ".", ".", ".", "."],
                                [".", ".", ".", ".", ".", ".", ".", "."],
                                [".", ".", ".", ".", ".", ".", ".", "."],
                                [".", ".", ".", ".", ".", ".", ".", "."],
                                [".", ".", ".", ".", ".", ".", ".", "."]
                            ]);
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
                        } else if (response['action'] == testsAPI.dropAction) {
                            testsAPI.Equal(response['result'], testsAPI.actionResultBadId);
                            testsAPI.Examine(item_id);
                        } else if (response['action'] == testsAPI.examineAction) {
                            testsAPI.Ok(response['result']);
                            if (!self_examine){
                                self_examine = true;
                                testsAPI.Examine(player['id'], player['sid']);
                            } else {
                                testsAPI.Equal(response['inventory'].length, 0);
                                done();
                            }
                        }
                    });

                });

                it('should fail drop item[object doesn\'t exists]', function(done) {
                    var player = { x: 0.5, y: 0.5 };

                    testsAPI.SetWSHandler(function(e) {

                       var response = JSON.parse(e.data);

                        if (response['action'] == testsAPI.startTestingAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.SetUpConstants();
                        } else if (response['action'] == testsAPI.setUpConstAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.SetUpMap([
                                [".", ".", ".", "."],
                                [".", ".", ".", "."],
                                [".", ".", ".", "."],
                                [".", ".", ".", "."]
                            ]);
                        } else if (response['action'] == testsAPI.setUpMapAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.PutPlayer(player['x'], player['y']);
                        } else if (response['action'] == testsAPI.putPlayerAction) {
                            testsAPI.Ok(response['result']);
                            player['sid'] = response['sid'];
                            testsAPI.Drop(player['sid'], -1)
                        } else if (response['action'] == testsAPI.dropAction) {
                            testsAPI.Equal(response['result'], testsAPI.actionResultBadId);
                            done();
                        }
                    });

                });

                it('should fail drop player fist item[default weapon]', function(done) {
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
                            player.sid = response['sid'];
                            player.fist_id = response['fist_id'];
                            testsAPI.Drop(player.sid, player.fist_id);
                        } else if (response['action'] == testsAPI.dropAction) {
                            testsAPI.Equal(response['result'], testsAPI.actionResultBadId);
                            done();
                        }
                    });

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
                        } else if (response['action'] == testsAPI.setUpConstAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.SetUpMap([
                                [".", ".", ".", ".", ".", ".", ".", "."],
                                [".", ".", ".", ".", ".", ".", ".", "."],
                                [".", ".", ".", ".", ".", ".", ".", "."],
                                [".", ".", ".", ".", ".", ".", ".", "."],
                                [".", ".", ".", ".", ".", ".", ".", "."],
                                [".", ".", ".", ".", ".", ".", ".", "."],
                                [".", ".", ".", ".", ".", ".", ".", "."]
                            ]);
                        } else if (response['action'] == testsAPI.setUpMapAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.PutPlayer(player1['x'], player1['y'], [ testsAPI.MakeItem() ]);
                        } else if (response['action'] == testsAPI.putPlayerAction) {
                            testsAPI.Ok(response['result']);
                            if (firstPut) {
                                firstPut = false;
                                player1['id'] = response['id'];
                                player1['sid'] = response['sid'];
                                item_id = response['inventory'][0].id;
                                testsAPI.PutPlayer(player2['x'], player2['y']);
                            } else {
                                player2['sid'] = response['sid'];
                                testsAPI.PickUp(player2['sid'], item_id);
                            }
                        } else if (response['action'] == testsAPI.pickUpAction) {
                            testsAPI.Equal(response['result'], testsAPI.actionResultBadId);
                            testsAPI.Examine(player1['id'], player1['sid']);
                        } else if (response['action'] == testsAPI.examineAction) {
                            testsAPI.Equal(response['inventory'][0].id, item_id);
                            done();
                        }
                    });

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
                            
                        } else if (response['action'] == testsAPI.setUpConstAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.SetUpMap([
                                [".", ".", ".", ".", ".", ".", ".", "."],
                                [".", ".", ".", ".", ".", ".", ".", "."],
                                [".", ".", ".", ".", ".", ".", ".", "."],
                                [".", ".", ".", ".", ".", ".", ".", "."],
                                [".", ".", ".", ".", ".", ".", ".", "."],
                                [".", ".", ".", ".", ".", ".", ".", "."],
                                [".", ".", ".", ".", ".", ".", ".", "."]
                            ]);
                        } else if (response['action'] == testsAPI.setUpMapAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.PutPlayer(player1['x'], player1['y'], [ testsAPI.MakeItem() ]);
                            
                        } else if (response['action'] == testsAPI.putPlayerAction) {
                            testsAPI.Ok(response['result']);
                            if (firstPut) {
                                firstPut = false;
                                player1['id'] = response['id'];
                                player1['sid'] = response['sid'];
                                item_id = response['inventory'][0].id;
                                testsAPI.PutPlayer(player2['x'], player2['y']);
                            } else {
                                player2['sid'] = response['sid'];
                                testsAPI.Destroy(player2['sid'], item_id);
                            }
                        } else if (response['action'] == testsAPI.destroyAction) {
                                testsAPI.Equal(response['result'], testsAPI.actionResultBadId);
                                testsAPI.Examine(player1['id'], player1['sid']);
                        } else if (response['action'] == testsAPI.examineAction) {
                            testsAPI.Equal(response['inventory'][0].id, item_id);
                            done();
                        }
                    });

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
                        } else if (response['action'] == testsAPI.setUpConstAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.SetUpMap([
                                [".", ".", ".", ".", ".", ".", ".", "."],
                                [".", ".", ".", ".", ".", ".", ".", "."],
                                [".", ".", ".", ".", ".", ".", ".", "."],
                                [".", ".", ".", ".", ".", ".", ".", "."],
                                [".", ".", ".", ".", ".", ".", ".", "."],
                                [".", ".", ".", ".", ".", ".", ".", "."],
                                [".", ".", ".", ".", ".", ".", ".", "."]
                            ]);
                        } else if (response['action'] == testsAPI.setUpMapAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.PutPlayer(player1['x'], player1['y'], [ testsAPI.MakeItem() ]);
                        } else if (response['action'] == testsAPI.putPlayerAction) {
                            testsAPI.Ok(response['result']);
                            if (firstPut) {
                                firstPut = false;
                                player1['id'] = response['id'];
                                player1['sid'] = response['sid'];
                                item_id = response['inventory'][0].id;
                                testsAPI.PutPlayer(player2['x'], player2['y']);
                            } else {
                                player2['sid'] = response['sid'];
                                testsAPI.Drop(player2['sid'], item_id);
                            }
                        } else if (response['action'] == testsAPI.dropAction) {
                            testsAPI.Equal(response['result'], testsAPI.actionResultBadId);
                            testsAPI.Examine(player1['id'], player1['sid']);
                        } else if (response['action'] == testsAPI.examineAction) {
                            testsAPI.Equal(response['inventory'][0].id, item_id);
                            done();
                        }
                    });

                });

                it('should fail pick up item[too heavy]', function(done) {
                    var player = { x: 0.5, y: 0.5 };
                    var item_id = null;

                    testsAPI.SetWSHandler(function(e) {

                       var response = JSON.parse(e.data);

                        if (response['action'] == testsAPI.startTestingAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.SetUpConstants();
                        } else if (response['action'] == testsAPI.setUpConstAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.SetUpMap([
                                [".", ".", ".", "."],
                                [".", ".", ".", "."],
                                [".", ".", ".", "."],
                                [".", ".", ".", "."]
                            ]);
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
                        } else if (response['action'] == testsAPI.pickUpAction) {
                                testsAPI.Equal(response['result'], 'tooHeavy');
                                testsAPI.Examine(player['id'], player['sid']);
                        } else if (response['action'] == testsAPI.examineAction)  {
                            testsAPI.Equal(response['inventory'] == null || response['inventory'].length == 0, true);
                            done();
                        }
                    });

                });

                it('should successfully equip item', function(done) {
                    var player = { x: 0.5, y: 0.5 };
                    var item_id = null;

                    testsAPI.SetWSHandler(function(e) {

                       var response = JSON.parse(e.data);

                        if (response['action'] == testsAPI.startTestingAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.SetUpConstants();
                        } else if (response['action'] == testsAPI.setUpConstAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.SetUpMap([
                                [".", ".", ".", "."],
                                [".", ".", ".", "."],
                                [".", ".", ".", "."],
                                [".", ".", ".", "."]
                            ]);
                        } else if (response['action'] == testsAPI.setUpMapAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.PutPlayer(player['x'], player['y'], [ testsAPI.MakeItem() ]);
                        } else if (response['action'] == testsAPI.putPlayerAction) {
                            testsAPI.Ok(response['result']);
                            player['id'] = response['id'];
                            player['sid'] = response['sid'];
                            item_id = response['inventory'][0].id;
                            testsAPI.Equip(player['sid'], item_id, "left-hand");
                        } else if (response['action'] == testsAPI.equipAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.Examine(player['id'], player['sid']);
                        } else if (response['action'] == testsAPI.examineAction)  {
                            testsAPI.Equal(response['slots']['left-hand']['id'], item_id);
                            done();
                        }    
                    });

                });

                it('should fail equip item[badSlot]', function(done) {
                    var player = { x: 0.5, y: 0.5 };
                    var item_id = null;

                    testsAPI.SetWSHandler(function(e) {

                       var response = JSON.parse(e.data);

                        if (response['action'] == testsAPI.startTestingAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.SetUpConstants();
                            
                        } else if (response['action'] == testsAPI.setUpConstAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.SetUpMap([
                                [".", ".", ".", "."],
                                [".", ".", ".", "."],
                                [".", ".", ".", "."],
                                [".", ".", ".", "."]
                            ]);
                        } else if (response['action'] == testsAPI.setUpMapAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.PutPlayer(player['x'], player['y'], [ testsAPI.MakeItem() ]);
                        } else if (response['action'] == testsAPI.putPlayerAction) {
                            testsAPI.Ok(response['result']);
                            player['id'] = response['id'];
                            player['sid'] = response['sid'];
                            item_id = response['inventory'][0].id;
                            testsAPI.Equip(player['sid'], item_id, "LEFT|HEND");
                        } else if (response['action'] == testsAPI.equipAction) {
                            testsAPI.Equal(response['result'], 'badSlot');
                            testsAPI.Examine(player['id'], player['sid']);
                        } else if (response['action'] == testsAPI.examineAction)  {
                            testsAPI.Equal(response['slots'] == null || response['slots']['left-hand'] == null, true);
                            done();
                        }   
                    });

                });

                it('should fail equip player fist item[default weapon]', function(done) {
                    var player = { x: 0.5, y: 0.5 };
                    var item_id = null;

                    testsAPI.SetWSHandler(function(e) {

                       var response = JSON.parse(e.data);

                        if (response['action'] == testsAPI.startTestingAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.SetUpConstants();
                        } else if (response['action'] == testsAPI.setUpConstAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.SetUpMap([
                                [".", ".", ".", "."],
                                [".", ".", ".", "."],
                                [".", ".", ".", "."],
                                [".", ".", ".", "."]
                            ]);
                        } else if (response['action'] == testsAPI.setUpMapAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.PutPlayer(player['x'], player['y'], [ testsAPI.MakeItem() ]);
                        } else if (response['action'] == testsAPI.putPlayerAction) {
                            testsAPI.Ok(response['result']);
                            item_id = response['inventory'][0].id;
                            player.sid = response['sid'];
                            player.fist_id = response['fist_id'];
                            testsAPI.Equip(player.sid, player.fist_id, 'left-hand');
                        } else if (response['action'] == testsAPI.equipAction) {
                            testsAPI.Equal(response['result'], testsAPI.actionResultBadId);
                             testsAPI.Examine(player['id'], player['sid']);
                        } else if (response['action'] == testsAPI.examineAction)  {
                            testsAPI.Equal(response['slots'] == null || response['slots']['left-hand'] == null, true);
                            done();
                        }   
                    });

                });

                it('should successfully unequip item', function(done) {
                    var player = { x: 0.5, y: 0.5 };
                    var item_id = null;

                    testsAPI.SetWSHandler(function(e) {

                       var response = JSON.parse(e.data);

                        if (response['action'] == testsAPI.startTestingAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.SetUpConstants();
                            
                        } else if (response['action'] == testsAPI.setUpConstAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.SetUpMap([
                                [".", ".", ".", "."],
                                [".", ".", ".", "."],
                                [".", ".", ".", "."],
                                [".", ".", ".", "."]
                            ]);
                        } else if (response['action'] == testsAPI.setUpMapAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.PutPlayer(player['x'], player['y'], [ testsAPI.MakeItem() ], {}, { 'left-hand' : testsAPI.MakeItem() });
                        } else if (response['action'] == testsAPI.putPlayerAction) {
                            testsAPI.Ok(response['result']);
                            player['id'] = response['id'];
                            player['sid'] = response['sid'];
                            item_id = response['inventory'][0].id;
                            testsAPI.Unequip(player['sid'], "left-hand");
                        } else if (response['action'] == testsAPI.unequipAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.Examine(player['id'], player['sid']);
                        } else if (response['action'] == testsAPI.examineAction)  {
                            testsAPI.Equal(response['slots'] == null || response['slots']['left-hand'] == null, true);
                            done();
                        }   
                    });

                });

                it('should fail unequip item[badSlot]', function(done) {
                    var player = { x: 0.5, y: 0.5 };
                    var item_id = null;

                    testsAPI.SetWSHandler(function(e) {

                       var response = JSON.parse(e.data);

                        if (response['action'] == testsAPI.startTestingAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.SetUpConstants();
                            
                        } else if (response['action'] == testsAPI.setUpConstAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.SetUpMap([
                                [".", ".", ".", "."],
                                [".", ".", ".", "."],
                                [".", ".", ".", "."],
                                [".", ".", ".", "."]
                            ]);
                        } else if (response['action'] == testsAPI.setUpMapAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.PutPlayer(player['x'], player['y'], [ testsAPI.MakeItem() ], {}, { 'left-hand' : testsAPI.MakeItem() });
                        } else if (response['action'] == testsAPI.putPlayerAction) {
                            testsAPI.Ok(response['result']);
                            player['id'] = response['id'];
                            player['sid'] = response['sid'];
                            item_id = response['inventory'][0].id;
                            testsAPI.Unequip(player['sid'], "RIGHT-HENT");
                        } else if (response['action'] == testsAPI.unequipAction) {
                            testsAPI.Equal(response['result'], 'badSlot');
                            testsAPI.Examine(player['id'], player['sid']);
                        } else if (response['action'] == testsAPI.examineAction)  {
                            testsAPI.Equal(response['inventory'][0].id, item_id);
                            done();
                        }  
                    });

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
                            
                        } else if (response['action'] == testsAPI.setUpConstAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.SetUpMap([
                                [".", ".", ".", "."],
                                [".", ".", ".", "."],
                                [".", ".", ".", "."],
                                [".", ".", ".", "."]
                            ]);
                        } else if (response['action'] == testsAPI.setUpMapAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.PutPlayer(player['x'], player['y'], [ testsAPI.MakeItem() ]);
                        } else if (response['action'] == testsAPI.putPlayerAction) {
                            testsAPI.Ok(response['result']);
                            player['id'] = response['id'];
                            player['sid'] = response['sid'];
                            item_id = response['inventory'][0].id;
                            testsAPI.Equip(player['sid'], item_id, "left-hand");
                        } else if (response['action'] == testsAPI.equipAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.Examine(player['id'], player['sid']);
                        } else if (response['action'] == testsAPI.examineAction) {
                            if (first) {
                                first = false;
                                testsAPI.Equal(response['slots']['left-hand']['id'], item_id);
                                testsAPI.Unequip(player['sid'], 'left-hand');
                            } else {
                                testsAPI.Equal(response['slots'] == null || response['slots']['left-hand'] == null, true);
                                done();
                            }
                        } else if (response['action'] == testsAPI.unequipAction) {
                            testsAPI.Ok(response['result']);
                            testsAPI.Examine(player['id'], player['sid']);
                        }
                    });

                });

                function HardItemTest(Action, ActionName, desc) {
                    it('should successfully equip, then ' + desc + ' equipped item and equip new item', function(done) {
                        var player = { x: 0.5, y: 0.5 };
                        var item_id1 = null;
                        var item_id2 = null;
                        var isAction = false;

                        testsAPI.SetWSHandler(function(e) {

                           var response = JSON.parse(e.data);

                            if (response['action'] == testsAPI.startTestingAction) {
                                testsAPI.Ok(response['result']);
                                testsAPI.SetUpConstants();
                            } else if (response['action'] == testsAPI.setUpConstAction) {
                                testsAPI.Ok(response['result']);
                                testsAPI.SetUpMap([
                                    [".", ".", ".", "."],
                                    [".", ".", ".", "."],
                                    [".", ".", ".", "."],
                                    [".", ".", ".", "."]
                                ]);
                            } else if (response['action'] == testsAPI.setUpMapAction) {
                                testsAPI.Ok(response['result']);
                                testsAPI.PutPlayer(player['x'], player['y'], [ testsAPI.MakeItem(), testsAPI.MakeItem()  ]);
                            } else if (response['action'] == testsAPI.putPlayerAction) {
                                testsAPI.Ok(response['result']);
                                testsAPI.Equal(response['inventory'].length, 2);
                                player['id'] = response['id'];
                                player['sid'] = response['sid'];
                                item_id1 = response['inventory'][0].id;
                                item_id2 = response['inventory'][1].id;
                                testsAPI.Equip(player['sid'], item_id1, "left-hand");
                            } else if (response['action'] == testsAPI.equipAction) {
                                testsAPI.Ok(response['result']);
                                    if (isAction) {
                                        testsAPI.Examine(player['id'], player['sid']);
                                    } else {
                                        Action(player['sid'], item_id1);
                                    }
                            } else if (response['action'] == ActionName) {
                                isAction = true;
                                testsAPI.Equip(player['sid'], item_id2, "left-hand");
                            } else if (response['action'] == testsAPI.examineAction) {
                                testsAPI.Equal(response['slots']['left-hand']['id'], item_id2);
                                testsAPI.Equal(response['inventory'] == null || response['inventory'].length == 0, true);
                                done();
                            } else if (response['action'] == testsAPI.unequipAction) {
                                testsAPI.Ok(response['result']);
                                testsAPI.Examine(player['id'], player['sid']);
                            }
                        });

                    });
                }

                HardItemTest(testsAPI.Drop, testsAPI.dropAction, 'drop');
                HardItemTest(testsAPI.Destroy, testsAPI.destroyAction, 'destroy');
            });

            describe('Bonuses, effects', function(done) {

                it('should change stats by equipping item with bonus', function (done) {

                    var player = { x : 0.5, y : 0.5, "STRENGTH" : 10 };

                    var bonus = {
                        stat: "STRENGTH",
                        effectCalculation: "const",
                        value: 10
                    };

                    testsAPI.SetWSHandler(function(e) {

                        var response = JSON.parse(e.data);

                        switch (response['action']) {
                        case testsAPI.startTestingAction:
                            testsAPI.Ok(response['result']);
                            testsAPI.SetUpMap([
                                ['.', '.'],
                                ['.', '.']
                            ]);
                            break;
                        case testsAPI.setUpMapAction:
                            testsAPI.Ok(response['result']);
                            testsAPI.PutPlayer(player['x'], player['y'],
                                [ testsAPI.MakeItem(null, null, null, [bonus]) ],
                                { "STRENGTH" : 10 }
                            );
                            break;
                        case testsAPI.putPlayerAction:
                            testsAPI.Ok(response['result']);
                            testsAPI.Equip(response['sid'], response['inventory'][0].id, 'left-hand');
                            player['id'] = response['id'];
                            break;
                        case testsAPI.equipAction:
                            testsAPI.Ok(response['result']);
                            testsAPI.Examine(player['id']);
                            break;
                        case testsAPI.examineAction:
                            testsAPI.Ok(response['result']);
                            testsAPI.Equal(response['stats']['STRENGTH'], player['STRENGTH'] + bonus['value']);
                            done();
                        }

                    });

                });

                it('should change stats by unequipping item with bonus', function (done) {

                    var player = { x : 0.5, y : 0.5, "STRENGTH" : 10 };

                    var bonus = {
                        stat: "STRENGTH",
                        effectCalculation: "const",
                        value: 10
                    };

                    testsAPI.SetWSHandler(function(e) {

                        var response = JSON.parse(e.data);

                        switch (response['action']) {
                        case testsAPI.startTestingAction:
                            testsAPI.Ok(response['result']);
                            testsAPI.SetUpMap([
                                ['.', '.'],
                                ['.', '.']
                            ]);
                            break;
                        case testsAPI.setUpMapAction:
                            testsAPI.Ok(response['result']);
                            testsAPI.PutPlayer(player['x'], player['y'],
                                [],
                                { "STRENGTH" : 10 },
                                { 'left-hand' : testsAPI.MakeItem(null, null, null, [bonus]) }
                            );
                            break;
                        case testsAPI.putPlayerAction:
                            testsAPI.Ok(response['result']);
                            testsAPI.Unequip(response['sid'], 'left-hand');
                            player['id'] = response['id'];
                            break;
                        case testsAPI.unequipAction:
                            testsAPI.Ok(response['result']);
                            testsAPI.Examine(player['id']);
                            break;
                        case testsAPI.examineAction:
                            testsAPI.Ok(response['result']);
                            testsAPI.Equal(response['stats']['STRENGTH'], player['STRENGTH']);
                            done();
                        }
                    });

                });


                it('should keep stats same after equipping/unequipping item with bonus', function (done) {

                    var player = { x : 0.5, y : 0.5, "STRENGTH" : 10 };

                    var bonus = {
                        stat: "STRENGTH",
                        effectCalculation: "const",
                        value: 10
                    };

                    testsAPI.SetWSHandler(function(e) {

                        var response = JSON.parse(e.data);

                        switch (response['action']) {
                        case testsAPI.startTestingAction:
                            testsAPI.Ok(response['result']);
                            testsAPI.SetUpMap([
                                ['.', '.'],
                                ['.', '.']
                            ]);
                            break;
                        case testsAPI.setUpMapAction:
                            testsAPI.Ok(response['result']);
                            testsAPI.PutPlayer(player['x'], player['y'],
                                [ testsAPI.MakeItem(null, null, null, [bonus]) ],
                                { "STRENGTH" : 10 }
                            );
                            break;
                        case testsAPI.putPlayerAction:
                            testsAPI.Ok(response['result']);
                            testsAPI.Equip(response['sid'], response['inventory'][0].id, 'left-hand');
                            player['id'] = response['id'];
                            player['sid'] = response['sid'];
                            break;
                        case testsAPI.equipAction:
                            testsAPI.Ok(response['result']);
                            testsAPI.Unequip(player['sid'], 'left-hand');
                            break;
                        case testsAPI.unequipAction:
                            testsAPI.Ok(response['result']);
                            testsAPI.Examine(player['id']);
                            break;
                        case testsAPI.examineAction:
                            testsAPI.Ok(response['result']);
                            testsAPI.Equal(response['stats']['STRENGTH'], player['STRENGTH']);
                            done();
                        }
                    });

                });


            });


        });


    }


    return {
      Test: Test
    }
});