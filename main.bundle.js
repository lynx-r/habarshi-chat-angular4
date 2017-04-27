webpackJsonp([1,4],{

/***/ 100:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mime__ = __webpack_require__(364);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mime___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_mime__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HabarshiFile; });

var HabarshiFile = (function () {
    function HabarshiFile(file_name, full_url, preview_url) {
        this.file_name = file_name;
        this.full_url = full_url;
        this.preview_url = preview_url;
        this.type = __WEBPACK_IMPORTED_MODULE_0_mime__["lookup"](full_url);
    }
    HabarshiFile.fromText = function (text) {
        var rx = /<file_name>\|<([^>]*)>,<full_url>\|<([^>]*)>(?:,<preview_url>\|<([^>]*)>)?/g;
        var match = rx.exec(text);
        if (!match) {
            console.log(text);
            return null;
        }
        var file_name = match[1];
        var full_url = match[2];
        var preview_url = match[3];
        return new this(file_name, full_url, preview_url);
    };
    HabarshiFile.prototype.toString = function () {
        return "<HabarshiServiceMessage><file_name>|<" + this.file_name + ">,<full_url>|<" + this.full_url + ">,<preview_url>|<" + this.preview_url + ">";
    };
    return HabarshiFile;
}());

//# sourceMappingURL=habarshi-file.model.js.map

/***/ }),

/***/ 101:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return User; });
var User = (function () {
    function User(session, username, uploads, room) {
        this.session = session;
        this.username = username;
        this.uploads = uploads;
        this.room = room;
    }
    return User;
}());

//# sourceMappingURL=user.model.js.map

/***/ }),

/***/ 102:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_catch__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_catch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_catch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__model_message_model__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__shared_constants_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__util_util__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__user_service__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__model_server_status_enum__ = __webpack_require__(297);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__roster_service__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_rxjs_observable_EmptyObservable__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_rxjs_observable_EmptyObservable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_rxjs_observable_EmptyObservable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__query_params_service__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__model_message_type_enum__ = __webpack_require__(66);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TextingService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};













var TextingService = (function () {
    function TextingService(http, userService, rosterService, query, constants) {
        this.http = http;
        this.userService = userService;
        this.rosterService = rosterService;
        this.query = query;
        this.constants = constants;
    }
    TextingService.prototype.sendMessage = function (message) {
        var session = this.userService.getSession();
        var params = [
            "session=" + session,
            "text=" + message.text,
            "id=" + message.id,
            "to=" + message.to
        ].join('&');
        var queryUrl = this.query.getServerUrl() + "/v1/chat/send?" + params;
        return this.http.get(queryUrl)
            .map(this.extractMessage)
            .catch(__WEBPACK_IMPORTED_MODULE_6__util_util__["a" /* Utils */].handleError);
    };
    TextingService.prototype.extractMessage = function (response) {
        var body = response.json();
        return new __WEBPACK_IMPORTED_MODULE_8__model_server_status_enum__["a" /* ServerStatus */](body.comment, body.ok);
    };
    TextingService.prototype.getMessages = function (after) {
        return this.getAllMessages(null, null, after);
    };
    TextingService.prototype.getMessagesForPeriod = function (before, days) {
        return this.getAllMessages(before, days, null);
    };
    TextingService.prototype.getAllMessages = function (before, days, after) {
        var _this = this;
        var session = this.userService.getSession();
        if (session == null) {
            return new __WEBPACK_IMPORTED_MODULE_10_rxjs_observable_EmptyObservable__["EmptyObservable"]();
        }
        var buddy = this.rosterService.selectedUser;
        if (buddy == null) {
            return new __WEBPACK_IMPORTED_MODULE_10_rxjs_observable_EmptyObservable__["EmptyObservable"]();
        }
        var params = "session=" + session + "&with=" + buddy.jid;
        if (after != null) {
            params = params.concat("&after=" + after);
        }
        if (before != null) {
            params = params.concat("&before=" + before);
        }
        if (days != null) {
            params = params.concat("&days=" + days);
        }
        var queryUrl = this.query.getServerUrl() + "/user/mam?" + params;
        return this.http.get(queryUrl)
            .map(function (resp) {
            return _this.extractMessages(resp);
        }).catch(__WEBPACK_IMPORTED_MODULE_6__util_util__["a" /* Utils */].handleError);
    };
    TextingService.prototype.extractMessages = function (response) {
        var body = response.json();
        if (!body.ok) {
            throw new Error(body.comment);
        }
        return body.mam.history
            .map(function (item) {
            return new __WEBPACK_IMPORTED_MODULE_4__model_message_model__["a" /* Message */](item.from, item.id, item.jid, item.stamp, item.text, item.time, item.to, item.marker);
        });
    };
    TextingService.prototype.updateMessageStatuses = function (latestMessages, originMessages) {
        var _this = this;
        if (latestMessages.length == 0) {
            return new __WEBPACK_IMPORTED_MODULE_10_rxjs_observable_EmptyObservable__["EmptyObservable"]();
        }
        var session = this.userService.getSession();
        var ids = latestMessages.map(function (message) {
            return message.id;
        });
        var params = [
            "session=" + session,
            "ids=" + ids
        ].join('&');
        var queryUrl = this.query.getServerUrl() + "/user/mam_ack?" + params;
        return this.http.get(queryUrl)
            .map(function (resp) {
            var body = resp.json();
            if (!body.ok) {
                throw new Error(body.comment);
            }
            Object.entries(body.ack).forEach(function (_a) {
                var id = _a[0], marker = _a[1];
                var msgs = originMessages.filter(function (m) { return m.id == id; });
                if (msgs.length == 1) {
                    msgs[0].marker = marker;
                    if (marker == _this.constants.ACKNOWLEDGED || marker == _this.constants.MARKABLE) {
                        var index = latestMessages.indexOf(msgs[0]);
                        latestMessages.splice(index, 1);
                    }
                }
            });
            return latestMessages;
        })
            .catch(__WEBPACK_IMPORTED_MODULE_6__util_util__["a" /* Utils */].handleError);
    };
    TextingService.prototype.markMessages = function (latestMessages, marker) {
        if (latestMessages.length == 0) {
            return new __WEBPACK_IMPORTED_MODULE_10_rxjs_observable_EmptyObservable__["EmptyObservable"]();
        }
        var session = this.userService.getSession();
        for (var _i = 0, latestMessages_1 = latestMessages; _i < latestMessages_1.length; _i++) {
            var message = latestMessages_1[_i];
            if (message.marker == this.constants.ACKNOWLEDGED
                || __WEBPACK_IMPORTED_MODULE_6__util_util__["a" /* Utils */].getMessageType(message, this.userService.user.jid) == __WEBPACK_IMPORTED_MODULE_12__model_message_type_enum__["a" /* MessageType */].OUT) {
                continue;
            }
            var params = [
                "session=" + session,
                "message_id=" + message.id,
                "marker=" + marker,
                "to=" + message.to
            ].join('&');
            var queryUrl = this.query.getServerUrl() + "/v1/chat/marker?" + params;
            this.http.get(queryUrl)
                .map(function (resp) {
                var body = resp.json();
                if (!body.ok) {
                    throw new Error(body.comment);
                }
            })
                .catch(__WEBPACK_IMPORTED_MODULE_6__util_util__["a" /* Utils */].handleError)
                .subscribe();
        }
    };
    return TextingService;
}());
TextingService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_7__user_service__["a" /* UserService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_7__user_service__["a" /* UserService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_9__roster_service__["a" /* RosterService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_9__roster_service__["a" /* RosterService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_11__query_params_service__["a" /* QueryParamsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_11__query_params_service__["a" /* QueryParamsService */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_5__shared_constants_service__["a" /* ConstantsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__shared_constants_service__["a" /* ConstantsService */]) === "function" && _e || Object])
], TextingService);

var _a, _b, _c, _d, _e;
//# sourceMappingURL=texting.service.js.map

/***/ }),

/***/ 103:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_texting_service__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_user_service__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__model_message_model__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__util_guid__ = __webpack_require__(300);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__service_roster_service__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__shared_constants_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_add_observable_timer__ = __webpack_require__(88);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_add_observable_timer___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_rxjs_add_observable_timer__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_ng2_file_upload__ = __webpack_require__(242);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_ng2_file_upload___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_ng2_file_upload__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__model_habarshi_file_model__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__util_util__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__service_audio_service__ = __webpack_require__(298);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TextingComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};













var TextingComponent = (function () {
    function TextingComponent(textingService, userService, rosterService, audioService, constants) {
        this.textingService = textingService;
        this.userService = userService;
        this.rosterService = rosterService;
        this.audioService = audioService;
        this.constants = constants;
        this.latestMessages = [];
        this.beforeDays = 1;
        this.messages = [];
        this.initScroll = true;
        this.statusMessages = [];
        this.hasBaseDropZoneOver = false;
    }
    TextingComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.userService.userLoggedInEvent.subscribe(function () {
            // after login we have upload_url in store
            _this.initFileUploader();
            _this.refreshMessageSubscribtion = __WEBPACK_IMPORTED_MODULE_6_rxjs_Observable__["Observable"].timer(1000, _this.constants.REFRESH_MESSAGES_MILLISEC)
                .subscribe(function () { return _this.refreshMessages(); });
            _this.refreshRosterSubscription = __WEBPACK_IMPORTED_MODULE_6_rxjs_Observable__["Observable"].timer(0, _this.constants.REFRESH_ROSTER_MILLISEC)
                .subscribe(function () {
                _this.rosterService.getRoster()
                    .subscribe(function (roster) {
                    _this.roster = roster;
                    if (_this.initScroll) {
                        _this.getMessages();
                    }
                    _this.userService.user = _this.rosterService.users[_this.userService.user.username];
                });
            });
            _this.onBlur();
            _this.userService.userLoggedOutEvent.subscribe(function () {
                _this.refreshMessageSubscribtion.unsubscribe();
                _this.refreshRosterSubscription.unsubscribe();
                _this.messages = [];
            });
        });
        this.messageRef.nativeElement.innerText = '';
    };
    TextingComponent.prototype.onBlur = function () {
        var _this = this;
        this.blinkSubscription = __WEBPACK_IMPORTED_MODULE_6_rxjs_Observable__["Observable"].timer(0, 1000).subscribe(function () {
            if (_this.newMessage) {
                if (_this.blinkTitle) {
                    document.title = _this.constants.TITLE_NEW_MESSAGE;
                    _this.blinkTitle = false;
                }
                else {
                    document.title = _this.constants.TITLE;
                    _this.blinkTitle = true;
                }
            }
        });
    };
    TextingComponent.prototype.onFocus = function () {
        document.title = this.constants.TITLE;
        if (this.blinkSubscription) {
            this.blinkSubscription.unsubscribe();
            this.textingService.markMessages(this.latestMessages, this.constants.ACKNOWLEDGED);
        }
    };
    TextingComponent.prototype.initFileUploader = function () {
        var _this = this;
        this.fileUploaderOptions = {
            url: this.userService.user.uploads,
            autoUpload: true
        };
        this.uploader = new __WEBPACK_IMPORTED_MODULE_9_ng2_file_upload__["FileUploader"](this.fileUploaderOptions);
        this.uploader.onAfterAddingFile = function (file) {
            file.withCredentials = false;
        };
        this.uploader.onSuccessItem = function (item, response) {
            var body = JSON.parse(response);
            if (!body.ok) {
                __WEBPACK_IMPORTED_MODULE_11__util_util__["a" /* Utils */].handleError(body.comment);
                return;
            }
            var message = _this.createHabarshiMessage(item, body);
            _this.textingService.sendMessage(message).subscribe(function (data) {
                _this.messageSent(data, message);
            });
        };
    };
    TextingComponent.prototype.createHabarshiMessage = function (item, body) {
        var selectedUser = this.rosterService.selectedUser;
        var user = this.userService.user;
        var id = new __WEBPACK_IMPORTED_MODULE_4__util_guid__["a" /* GUID */]().toString();
        var habarshiText = new __WEBPACK_IMPORTED_MODULE_10__model_habarshi_file_model__["a" /* HabarshiFile */](item.file.name, body.full_url, body.preview_url);
        return new __WEBPACK_IMPORTED_MODULE_3__model_message_model__["a" /* Message */](user.jid, id, user.jid, new Date().getTime(), habarshiText.toString(), new Date(), selectedUser.jid);
    };
    TextingComponent.prototype.ngAfterViewChecked = function () {
        this.scrollBottom();
    };
    TextingComponent.prototype.getMessages = function () {
        var _this = this;
        this.textingService.getMessages()
            .subscribe(function (messages) {
            _this.messages = messages;
            _this.errorMessage = '';
            _this.statusMessages = messages.slice();
        }, function (error) { return _this.errorMessage = error; });
    };
    TextingComponent.prototype.refreshMessages = function () {
        var _this = this;
        if (this.messages.length == 0) {
            return;
        }
        var after = this.messages[this.messages.length - 1].id;
        this.textingService.getMessages(after).subscribe(function (latest) {
            if (latest.length != 0) {
                _this.messages = _this.messages.concat(latest);
                _this.latestMessages = latest;
                _this.newMessage = true;
                _this.textingService.markMessages(latest, _this.constants.RECEIVED);
            }
        });
        this.textingService.updateMessageStatuses(this.statusMessages, this.messages).subscribe(function (messages) {
            _this.statusMessages = messages;
        });
    };
    TextingComponent.prototype.scrollBottom = function () {
        var _this = this;
        if (this.messagesRef == null) {
            return;
        }
        var nativeElement = this.messagesRef.nativeElement;
        if (this.newMessage || this.initScroll) {
            nativeElement.scrollTop = nativeElement.scrollTop +
                nativeElement.scrollHeight;
            if (document.hasFocus()) {
                this.newMessage = false;
            }
            if (nativeElement.scrollTop > 0) {
                __WEBPACK_IMPORTED_MODULE_6_rxjs_Observable__["Observable"].timer(2000).subscribe(function () {
                    _this.initScroll = false;
                });
            }
        }
        if (nativeElement.scrollTop < nativeElement.scrollHeight / 2 && this.messages.length > 0 && !this.getForPeriod) {
            var before = this.messages[0].id;
            this.textingService.getMessagesForPeriod(before, this.beforeDays).subscribe(function (beforeMessages) {
                if (beforeMessages.length == 0) {
                    _this.beforeDays = 0;
                    return;
                }
                _this.messages = beforeMessages.concat(_this.messages);
                _this.getForPeriod = false;
                // nativeElement.scrollTop = nativeElement.scrollHeight / 2;
            });
            this.getForPeriod = true;
            this.beforeDays++;
        }
    };
    TextingComponent.prototype.onSendMessage = function (event) {
        var _this = this;
        var text = this.messageRef.nativeElement.innerHTML;
        if (!text || event != null && (event.keyCode != 13 || event.keyCode == 13 && event.shiftKey)) {
            return;
        }
        var selectedUser = this.rosterService.selectedUser;
        var user = this.userService.user;
        var id = new __WEBPACK_IMPORTED_MODULE_4__util_guid__["a" /* GUID */]().toString();
        var message = new __WEBPACK_IMPORTED_MODULE_3__model_message_model__["a" /* Message */](user.jid, id, user.jid, new Date().getTime(), text, new Date(), selectedUser.jid);
        this.textingService.sendMessage(message)
            .subscribe(function (data) {
            _this.messageSent(data, message);
        }, function (error) { return _this.errorMessage = error; });
    };
    TextingComponent.prototype.onSelectFile = function () {
        this.uploadFileRef.nativeElement.click();
    };
    TextingComponent.prototype.onChangeFileUpload = function () {
        var file = this.uploadFileRef.nativeElement.files[0];
        if (file == null) {
            return;
        }
        this.uploader.addToQueue([file]);
        this.uploader.uploadAll();
    };
    TextingComponent.prototype.messageSent = function (data, message) {
        if (data.ok) {
            this.messages.push(message);
            this.statusMessages.push(message);
            this.messageRef.nativeElement.innerText = '';
            this.errorMessage = '';
        }
        else {
            this.errorMessage = data.comment;
        }
        this.newMessage = true;
    };
    TextingComponent.prototype.onFileOver = function (e) {
        this.hasBaseDropZoneOver = e;
    };
    TextingComponent.prototype.onSendAudioMessage = function () {
        var _this = this;
        if (!__WEBPACK_IMPORTED_MODULE_12__service_audio_service__["a" /* AudioService */].isSupportRecording()) {
            __WEBPACK_IMPORTED_MODULE_11__util_util__["a" /* Utils */].handleError('Запись аудио не поддерживается');
            return;
        }
        this.audioService.toggle().then(function (file) {
            if (!file) {
                var timer = __WEBPACK_IMPORTED_MODULE_6_rxjs_Observable__["Observable"].timer(0, 1000);
                _this.toggleRedSubscription = timer.subscribe(function () {
                    _this.toggleRed = !_this.toggleRed;
                });
                return;
            }
            // got file
            _this.toggleRed = false;
            _this.toggleRedSubscription.unsubscribe();
            _this.uploader.addToQueue([file]);
            _this.uploader.uploadAll();
        });
    };
    TextingComponent.prototype.getRed = function () {
        if (this.toggleRed) {
            return 'red';
        }
        return '';
    };
    TextingComponent.prototype.isLoggedIn = function () {
        return this.userService.loggedIn;
    };
    return TextingComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('messageRef'),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"]) === "function" && _a || Object)
], TextingComponent.prototype, "messageRef", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('messagesRef'),
    __metadata("design:type", typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"]) === "function" && _b || Object)
], TextingComponent.prototype, "messagesRef", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('uploadFileRef'),
    __metadata("design:type", typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"]) === "function" && _c || Object)
], TextingComponent.prototype, "uploadFileRef", void 0);
TextingComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-texting',
        template: __webpack_require__(374),
        styles: [__webpack_require__(361)],
        providers: [__WEBPACK_IMPORTED_MODULE_12__service_audio_service__["a" /* AudioService */], __WEBPACK_IMPORTED_MODULE_1__service_texting_service__["a" /* TextingService */]]
    }),
    __metadata("design:paramtypes", [typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_1__service_texting_service__["a" /* TextingService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__service_texting_service__["a" /* TextingService */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_2__service_user_service__["a" /* UserService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__service_user_service__["a" /* UserService */]) === "function" && _e || Object, typeof (_f = typeof __WEBPACK_IMPORTED_MODULE_5__service_roster_service__["a" /* RosterService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__service_roster_service__["a" /* RosterService */]) === "function" && _f || Object, typeof (_g = typeof __WEBPACK_IMPORTED_MODULE_12__service_audio_service__["a" /* AudioService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_12__service_audio_service__["a" /* AudioService */]) === "function" && _g || Object, typeof (_h = typeof __WEBPACK_IMPORTED_MODULE_7__shared_constants_service__["a" /* ConstantsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_7__shared_constants_service__["a" /* ConstantsService */]) === "function" && _h || Object])
], TextingComponent);

var _a, _b, _c, _d, _e, _f, _g, _h;
//# sourceMappingURL=texting.component.js.map

/***/ }),

/***/ 23:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(5);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConstantsService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ConstantsService = (function () {
    function ConstantsService() {
        this.SERVER_URL = 'serverurl';
        this.DATE_FORMAT = 'h:mm, d MMM YYYY';
        this.SESSION_KEY = 'session';
        this.REFRESH_ROSTER_MILLISEC = 60 * 1000;
        this.REFRESH_MESSAGES_MILLISEC = 2500;
        this.QUERY_PARAMS = 'queryparams';
        this.HABARSHI_SERVICE_MESSAGE = '<HabarshiServiceMessage>';
        this.ROBOT_ROOMS = 'robot.rooms@habarshi.com';
        this.TITLE = 'Habarshi';
        this.TITLE_NEW_MESSAGE = 'Новое сообщение';
        this.RECEIVED = 'received';
        this.ACKNOWLEDGED = 'acknowledged';
        this.MARKABLE = 'markable';
        this.UPLOAD_PROTOCOL = 'https';
    }
    return ConstantsService;
}());
ConstantsService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [])
], ConstantsService);

//# sourceMappingURL=constants.service.js.map

/***/ }),

/***/ 26:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_observable_throw__ = __webpack_require__(245);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_observable_throw___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_add_observable_throw__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__model_message_type_enum__ = __webpack_require__(66);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Utils; });



var Utils = (function () {
    function Utils() {
    }
    Utils.handleError = function (error) {
        // In a real world app, you might use a remote logging infrastructure
        var errMsg;
        if (error instanceof Response) {
            var body = error.json() || '';
            var err = body.error || JSON.stringify(body);
            errMsg = error.status + " - " + (error.statusText || '') + " " + err;
        }
        else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        alert(errMsg);
        localStorage.clear();
        return __WEBPACK_IMPORTED_MODULE_0_rxjs_Observable__["Observable"].throw(errMsg);
    };
    Utils.getMessageType = function (message, originFromJid) {
        if (message.from == originFromJid) {
            return __WEBPACK_IMPORTED_MODULE_2__model_message_type_enum__["a" /* MessageType */].OUT;
        }
        else {
            return __WEBPACK_IMPORTED_MODULE_2__model_message_type_enum__["a" /* MessageType */].IN;
        }
    };
    return Utils;
}());

//# sourceMappingURL=util.js.map

/***/ }),

/***/ 282:
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 282;


/***/ }),

/***/ 283:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__(288);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__(292);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__(301);




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["enableProdMode"])();
}
else if (!/localhost/.test(document.location.host)) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["enableProdMode"])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 290:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__(289);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__texting_texting_component__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__auth_guard__ = __webpack_require__(99);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppRoutingModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





var appRoutes = [
    {
        path: '',
        component: __WEBPACK_IMPORTED_MODULE_3__texting_texting_component__["a" /* TextingComponent */],
        pathMatch: 'full',
        canActivate: [__WEBPACK_IMPORTED_MODULE_4__auth_guard__["a" /* AuthGuard */]]
    },
    {
        path: 'profile', children: []
    }
];
var AppRoutingModule = (function () {
    function AppRoutingModule() {
    }
    return AppRoutingModule;
}());
AppRoutingModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        imports: [
            __WEBPACK_IMPORTED_MODULE_1__angular_common__["CommonModule"],
            __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* RouterModule */].forRoot(appRoutes)
        ],
        exports: [
            __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* RouterModule */]
        ],
        declarations: []
    })
], AppRoutingModule);

//# sourceMappingURL=app-routing.module.js.map

/***/ }),

/***/ 291:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_moment__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var AppComponent = (function () {
    function AppComponent() {
        this.title = 'app works!';
    }
    AppComponent.prototype.ngOnInit = function () {
        __WEBPACK_IMPORTED_MODULE_1_moment__["locale"]('ru-ru');
    };
    return AppComponent;
}());
AppComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-root',
        template: __webpack_require__(370),
        styles: [__webpack_require__(357)]
    })
], AppComponent);

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 292:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(287);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__(291);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__texting_texting_component__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__texting_message_message_component__ = __webpack_require__(299);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__header_header_component__ = __webpack_require__(294);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__footer_footer_component__ = __webpack_require__(293);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__service_texting_service__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__service_user_service__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__shared_constants_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__service_roster_service__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_ng2_file_upload__ = __webpack_require__(242);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_ng2_file_upload___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13_ng2_file_upload__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__app_routing_module__ = __webpack_require__(290);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__auth_guard__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__service_query_params_service__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17_angular2_moment__ = __webpack_require__(302);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17_angular2_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_17_angular2_moment__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


















var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */],
            __WEBPACK_IMPORTED_MODULE_5__texting_texting_component__["a" /* TextingComponent */],
            __WEBPACK_IMPORTED_MODULE_6__texting_message_message_component__["a" /* MessageComponent */],
            __WEBPACK_IMPORTED_MODULE_7__header_header_component__["a" /* HeaderComponent */],
            __WEBPACK_IMPORTED_MODULE_8__footer_footer_component__["a" /* FooterComponent */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormsModule */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["b" /* ReactiveFormsModule */],
            __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* HttpModule */],
            __WEBPACK_IMPORTED_MODULE_13_ng2_file_upload__["FileUploadModule"],
            __WEBPACK_IMPORTED_MODULE_14__app_routing_module__["a" /* AppRoutingModule */],
            __WEBPACK_IMPORTED_MODULE_17_angular2_moment__["MomentModule"]
        ],
        providers: [__WEBPACK_IMPORTED_MODULE_15__auth_guard__["a" /* AuthGuard */], __WEBPACK_IMPORTED_MODULE_11__shared_constants_service__["a" /* ConstantsService */], __WEBPACK_IMPORTED_MODULE_16__service_query_params_service__["a" /* QueryParamsService */], __WEBPACK_IMPORTED_MODULE_9__service_texting_service__["a" /* TextingService */], __WEBPACK_IMPORTED_MODULE_10__service_user_service__["a" /* UserService */], __WEBPACK_IMPORTED_MODULE_12__service_roster_service__["a" /* RosterService */]],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */]]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 293:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(5);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FooterComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var FooterComponent = (function () {
    function FooterComponent() {
    }
    FooterComponent.prototype.ngOnInit = function () {
    };
    return FooterComponent;
}());
FooterComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-footer',
        template: __webpack_require__(371),
        styles: [__webpack_require__(358)]
    }),
    __metadata("design:paramtypes", [])
], FooterComponent);

//# sourceMappingURL=footer.component.js.map

/***/ }),

/***/ 294:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_user_service__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__ = __webpack_require__(376);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_timer__ = __webpack_require__(88);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_timer___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_timer__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HeaderComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var HeaderComponent = (function () {
    function HeaderComponent(userService) {
        this.userService = userService;
        this.anonym = 0;
    }
    HeaderComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.userService.loggedIn) {
            __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__["Observable"].timer(500).subscribe(function () {
                _this.userService.sessionConfig()
                    .subscribe(function (user) {
                    _this.errorMessage = '';
                }, function (error) { return _this.errorMessage; });
            });
        }
    };
    HeaderComponent.prototype.isLoggedIn = function () {
        return this.userService.loggedIn;
    };
    HeaderComponent.prototype.auth = function (usernameEl, passwd) {
        var _this = this;
        var username = usernameEl.value.trim();
        if (!(username && passwd.value)) {
            this.errorMessage = 'Укажите логин и пароль';
            return;
        }
        this.userService.auth(username, passwd.value)
            .subscribe(function (user) {
            _this.errorMessage = '';
            // JOIN TO GROUP CHAT
            _this.userService.join().subscribe(function () {
            }, function (error) { return _this.errorMessage = error; });
        }, function (error) { return _this.errorMessage = error; });
    };
    HeaderComponent.prototype.create = function (nameEl, fullnameEl) {
        var _this = this;
        var name = nameEl.value.trim();
        if (!name) {
            this.errorMessage = 'Укажите ваше имя';
            return;
        }
        var fullname = fullnameEl.value.trim();
        this.userService.create(name, fullname)
            .subscribe(function (user) {
            _this.errorMessage = '';
            // JOIN TO GROUP CHAT
            _this.userService.join().subscribe(function () {
            }, function (error) { return _this.errorMessage = error; });
        }, function (error) { return _this.errorMessage = error; });
    };
    HeaderComponent.prototype.logout = function () {
        var _this = this;
        this.userService.leave().subscribe(function () {
            _this.doLogout();
        }, function () {
            _this.doLogout();
        });
    };
    HeaderComponent.prototype.doLogout = function () {
        var _this = this;
        this.userService.logout()
            .subscribe(function () {
            _this.errorMessage = '';
        }, function (error) { return _this.errorMessage = error; });
    };
    return HeaderComponent;
}());
HeaderComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-header',
        template: __webpack_require__(372),
        styles: [__webpack_require__(359)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__service_user_service__["a" /* UserService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__service_user_service__["a" /* UserService */]) === "function" && _a || Object])
], HeaderComponent);

var _a;
//# sourceMappingURL=header.component.js.map

/***/ }),

/***/ 295:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HabarshiMessageType; });
var HabarshiMessageType;
(function (HabarshiMessageType) {
    HabarshiMessageType[HabarshiMessageType["TEXT"] = 0] = "TEXT";
    HabarshiMessageType[HabarshiMessageType["FILE"] = 1] = "FILE";
    HabarshiMessageType[HabarshiMessageType["ROBOT"] = 2] = "ROBOT";
})(HabarshiMessageType || (HabarshiMessageType = {}));
//# sourceMappingURL=habarshi-message-type.enum.js.map

/***/ }),

/***/ 296:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HabarshiRobot; });
var HabarshiRobot = (function () {
    function HabarshiRobot(action, actor, object) {
        this.action = action;
        this.actor = actor;
        this.object = object;
    }
    HabarshiRobot.fromText = function (text) {
        var rx = /<action>\|<([^>]*)>,[\n\s]*<actor>\|<([^>]*)>,[\n\s]*<object>\|<([^>]*)>/g;
        var match = rx.exec(text);
        var file_name = match[1];
        var full_url = match[2];
        var preview_url = match[3];
        return new this(file_name, full_url, preview_url);
    };
    HabarshiRobot.prototype.toString = function () {
        return "<HabarshiServiceMessage><action>|<" + this.action + ">,<actor>|<" + this.actor + ">,<object>|<" + this.object + ">";
    };
    return HabarshiRobot;
}());

//# sourceMappingURL=habarshi-robot.model.js.map

/***/ }),

/***/ 297:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ServerStatus; });
var ServerStatus = (function () {
    function ServerStatus(comment, ok) {
        this.comment = comment;
        this.ok = ok;
    }
    return ServerStatus;
}());

//# sourceMappingURL=server-status.enum.js.map

/***/ }),

/***/ 298:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_util__ = __webpack_require__(26);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AudioService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AudioService = AudioService_1 = (function () {
    function AudioService() {
        var _this = this;
        this.chunks = [];
        this.constraints = { audio: true };
        this.blobReady = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        if (AudioService_1.isSupportRecording()) {
            navigator.mediaDevices.getUserMedia(this.constraints).then(function (stream) {
                _this.mediaRecorder = new MediaRecorder(stream);
                _this.mediaRecorder.ondataavailable = function (e) {
                    _this.blobReady.emit(e.data);
                };
            }, __WEBPACK_IMPORTED_MODULE_1__util_util__["a" /* Utils */].handleError);
        }
        else {
        }
    }
    AudioService.prototype.toggle = function () {
        if (this.recording) {
            return this.stop();
        }
        else {
            return this.start();
        }
    };
    AudioService.prototype.start = function () {
        this.mediaRecorder.start();
        this.recording = true;
        return Promise.resolve(false);
    };
    AudioService.prototype.stop = function () {
        var _this = this;
        this.mediaRecorder.stop();
        return new Promise(function (resolve, reject) {
            _this.blobReady.subscribe(function (blob) {
                var file = new File([blob], 'audio-' + (new Date).toISOString().replace(/[:.]/g, '-') + '.webm', { 'type': 'video/webm' });
                _this.chunks = [];
                _this.recording = false;
                resolve(file);
            }, function (error) {
                __WEBPACK_IMPORTED_MODULE_1__util_util__["a" /* Utils */].handleError(error);
                reject(null);
            });
        });
    };
    AudioService.isSupportRecording = function () {
        return !!navigator.mediaDevices;
    };
    return AudioService;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
    __metadata("design:type", Object)
], AudioService.prototype, "blobReady", void 0);
AudioService = AudioService_1 = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [])
], AudioService);

var AudioService_1;
//# sourceMappingURL=audio.service.js.map

/***/ }),

/***/ 299:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__model_message_model__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_user_service__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__model_message_type_enum__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__shared_constants_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__util_util__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__service_roster_service__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__model_habarshi_file_model__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__model_habarshi_robot_model__ = __webpack_require__(296);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__model_habarshi_message_type_enum__ = __webpack_require__(295);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MessageComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










var MessageComponent = (function () {
    function MessageComponent(userService, rosterService, constants) {
        this.userService = userService;
        this.rosterService = rosterService;
        this.constants = constants;
        this.MessageType = __WEBPACK_IMPORTED_MODULE_3__model_message_type_enum__["a" /* MessageType */];
        this.HabarshiMessage = __WEBPACK_IMPORTED_MODULE_9__model_habarshi_message_type_enum__["a" /* HabarshiMessageType */];
        this.dateFormat = constants.DATE_FORMAT;
    }
    MessageComponent.prototype.ngOnInit = function () {
        this.user = this.userService.user;
        var username = this.message.from.split('@')[0];
        var users = this.rosterService.users;
        if (this.message.text.startsWith(this.constants.HABARSHI_SERVICE_MESSAGE)) {
            if (this.message.from == this.constants.ROBOT_ROOMS) {
                this.habarshiRobot = __WEBPACK_IMPORTED_MODULE_8__model_habarshi_robot_model__["a" /* HabarshiRobot */].fromText(this.message.text);
                this.habarshiMessageType = __WEBPACK_IMPORTED_MODULE_9__model_habarshi_message_type_enum__["a" /* HabarshiMessageType */].ROBOT;
                this.messageType = __WEBPACK_IMPORTED_MODULE_3__model_message_type_enum__["a" /* MessageType */].SERVICE;
                this.fullName(users, this.habarshiRobot.actor);
            }
            else {
                this.habarshiFile = __WEBPACK_IMPORTED_MODULE_7__model_habarshi_file_model__["a" /* HabarshiFile */].fromText(this.message.text);
                this.habarshiMessageType = __WEBPACK_IMPORTED_MODULE_9__model_habarshi_message_type_enum__["a" /* HabarshiMessageType */].FILE;
                this.messageType = __WEBPACK_IMPORTED_MODULE_5__util_util__["a" /* Utils */].getMessageType(this.message, this.user.jid);
                this.fullName(users, username);
            }
        }
        else {
            this.habarshiMessageType = __WEBPACK_IMPORTED_MODULE_9__model_habarshi_message_type_enum__["a" /* HabarshiMessageType */].TEXT;
            this.messageType = __WEBPACK_IMPORTED_MODULE_5__util_util__["a" /* Utils */].getMessageType(this.message, this.user.jid);
            this.fullName(users, username);
        }
    };
    MessageComponent.prototype.fullName = function (users, username) {
        var userFromRoster = users[username];
        if (userFromRoster != null) {
            this.fromFull = userFromRoster.name;
        }
        else {
            this.fromFull = '';
        }
    };
    return MessageComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__model_message_model__["a" /* Message */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__model_message_model__["a" /* Message */]) === "function" && _a || Object)
], MessageComponent.prototype, "message", void 0);
MessageComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-message',
        template: __webpack_require__(373),
        styles: [__webpack_require__(360)]
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__service_user_service__["a" /* UserService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__service_user_service__["a" /* UserService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_6__service_roster_service__["a" /* RosterService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_6__service_roster_service__["a" /* RosterService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4__shared_constants_service__["a" /* ConstantsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__shared_constants_service__["a" /* ConstantsService */]) === "function" && _d || Object])
], MessageComponent);

var _a, _b, _c, _d;
//# sourceMappingURL=message.component.js.map

/***/ }),

/***/ 30:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__model_user_model__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_store__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shared_constants_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_http__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__util_util__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_catch__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_catch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_catch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_map__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__query_params_service__ = __webpack_require__(49);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RosterService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var RosterService = (function () {
    function RosterService(http, query, constants) {
        this.http = http;
        this.query = query;
        this.constants = constants;
        this.users = new Map();
    }
    RosterService.prototype.createBuddy = function () {
        var queryParams = __WEBPACK_IMPORTED_MODULE_2__util_store__["a" /* Store */].get(this.constants.QUERY_PARAMS);
        if (queryParams == null) {
            __WEBPACK_IMPORTED_MODULE_5__util_util__["a" /* Utils */].handleError('Некорректная ссылка');
            return;
        }
        var to = queryParams.to;
        this.selectedUser = new __WEBPACK_IMPORTED_MODULE_1__model_user_model__["a" /* User */](null, to, null, true);
        this.selectedUser.jid = to;
    };
    RosterService.prototype.getRoster = function () {
        var _this = this;
        var session = __WEBPACK_IMPORTED_MODULE_2__util_store__["a" /* Store */].get(this.constants.SESSION_KEY);
        if (session == null) {
            return;
        }
        if (this.selectedUser == null) {
            this.createBuddy();
        }
        var queryUrl = this.query.getServerUrl() + "/user/roster?session=" + session;
        return this.http.get(queryUrl)
            .map(function (resp) {
            _this.extractRoster(resp);
        }).catch(__WEBPACK_IMPORTED_MODULE_5__util_util__["a" /* Utils */].handleError);
    };
    RosterService.prototype.extractRoster = function (resp) {
        var body = resp.json();
        try {
            if (body.ok == false) {
                throw new Error(body.comment);
            }
        }
        finally {
            this.roster = null;
        }
        this.roster = body;
        this.parseUsers(this.roster);
        return this.roster;
    };
    RosterService.prototype.parseUsers = function (roster) {
        var _this = this;
        roster.forEach(function (r) {
            r.users.forEach(function (item) {
                _this.users[item.username] = item;
            });
            if (r.children.length != 0) {
                _this.parseUsers(r.children);
            }
        });
    };
    return RosterService;
}());
RosterService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_4__angular_http__["b" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__angular_http__["b" /* Http */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_8__query_params_service__["a" /* QueryParamsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_8__query_params_service__["a" /* QueryParamsService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__shared_constants_service__["a" /* ConstantsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__shared_constants_service__["a" /* ConstantsService */]) === "function" && _c || Object])
], RosterService);

var _a, _b, _c;
//# sourceMappingURL=roster.service.js.map

/***/ }),

/***/ 300:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GUID; });
var GUID = (function () {
    function GUID(str) {
        this.str = str || GUID.getNewGUIDString();
    }
    GUID.prototype.toString = function () {
        return this.str;
    };
    GUID.getNewGUIDString = function () {
        // your favourite guid generation function could go here
        // ex: http://stackoverflow.com/a/8809472/188246
        var d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function") {
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    };
    return GUID;
}());

//# sourceMappingURL=guid.js.map

/***/ }),

/***/ 301:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// The file contents for the current environment will overwrite these during build.
var environment = {
    production: false
};
//# sourceMappingURL=environment.js.map

/***/ }),

/***/ 34:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__model_user_model__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__shared_constants_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__util_util__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__util_store__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__query_params_service__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_observable_EmptyObservable__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_observable_EmptyObservable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_rxjs_observable_EmptyObservable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__roster_service__ = __webpack_require__(30);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










var UserService = (function () {
    function UserService(http, rosterService, query, constants) {
        this.http = http;
        this.rosterService = rosterService;
        this.query = query;
        this.constants = constants;
        this.loggedIn = false;
        this.userLoggedInEvent = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.userLoggedOutEvent = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.loggedIn = !!__WEBPACK_IMPORTED_MODULE_6__util_store__["a" /* Store */].get(this.constants.SESSION_KEY);
    }
    UserService.prototype.ngOnInit = function () {
    };
    UserService.prototype.sessionConfig = function () {
        var _this = this;
        var session = __WEBPACK_IMPORTED_MODULE_6__util_store__["a" /* Store */].get(this.constants.SESSION_KEY);
        var queryUrl = this.query.getServerUrl() + "/session-config?session=" + session;
        return this.http.get(queryUrl)
            .map(function (resp) {
            _this.extractUser(resp);
            _this.userLoggedInEvent.emit(_this.user);
            _this.loggedIn = true;
        }).catch(__WEBPACK_IMPORTED_MODULE_5__util_util__["a" /* Utils */].handleError);
    };
    UserService.prototype.auth = function (username, passwd) {
        var _this = this;
        if (this.loggedIn) {
            return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].of(this.user);
        }
        var serverUrl = this.query.getServerUrl();
        var params = [
            "username=" + username,
            "password=" + passwd
        ].join('&');
        var queryUrl = serverUrl + "/auth/1?" + params;
        return this.http.get(queryUrl)
            .map(function (resp) {
            _this.extractUser(resp);
            _this.loggedIn = true;
        }).catch(__WEBPACK_IMPORTED_MODULE_5__util_util__["a" /* Utils */].handleError);
    };
    UserService.prototype.create = function (name, fullname) {
        var _this = this;
        if (this.loggedIn) {
            return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].of(this.user);
        }
        var serverUrl = this.query.getServerUrl();
        var params = "name=" + name;
        if (fullname != null) {
            params = params.concat("&fullname=" + fullname);
        }
        var queryUrl = serverUrl + "/anonymous/1?" + params;
        return this.http.get(queryUrl)
            .map(function (resp) {
            _this.extractUser(resp);
            _this.loggedIn = true;
        }).catch(__WEBPACK_IMPORTED_MODULE_5__util_util__["a" /* Utils */].handleError);
    };
    UserService.prototype.join = function () {
        var _this = this;
        if (!this.loggedIn) {
            return new __WEBPACK_IMPORTED_MODULE_8_rxjs_observable_EmptyObservable__["EmptyObservable"]();
        }
        var session = __WEBPACK_IMPORTED_MODULE_6__util_store__["a" /* Store */].get(this.constants.SESSION_KEY);
        var buddy = this.rosterService.selectedUser;
        if (buddy == null) {
            return new __WEBPACK_IMPORTED_MODULE_8_rxjs_observable_EmptyObservable__["EmptyObservable"]();
        }
        var params = [
            "session=" + session,
            "to=" + buddy.jid
        ].join('&');
        var queryUrl = this.query.getServerUrl() + "/v1/chat/join?" + params;
        return this.http.get(queryUrl).map(function (resp) {
            var body = resp.json();
            if (!body.ok) {
                throw new Error(body.comment);
            }
            _this.userLoggedInEvent.emit(_this.user);
        }).catch(__WEBPACK_IMPORTED_MODULE_5__util_util__["a" /* Utils */].handleError);
    };
    UserService.prototype.leave = function () {
        if (!this.loggedIn) {
            return new __WEBPACK_IMPORTED_MODULE_8_rxjs_observable_EmptyObservable__["EmptyObservable"]();
        }
        var session = __WEBPACK_IMPORTED_MODULE_6__util_store__["a" /* Store */].get(this.constants.SESSION_KEY);
        var buddy = this.rosterService.selectedUser;
        if (buddy == null) {
            return new __WEBPACK_IMPORTED_MODULE_8_rxjs_observable_EmptyObservable__["EmptyObservable"]();
        }
        var params = [
            "session=" + session,
            "jid=" + buddy.jid
        ].join('&');
        var queryUrl = this.query.getServerUrl() + "/v1/chat/leave?" + params;
        return this.http.get(queryUrl).map(function (resp) {
            var body = resp.json();
            if (!body.ok) {
                throw new Error(body.comment);
            }
        }).catch(__WEBPACK_IMPORTED_MODULE_5__util_util__["a" /* Utils */].handleError);
    };
    UserService.prototype.logout = function () {
        var _this = this;
        if (!this.loggedIn) {
            return;
        }
        var session = __WEBPACK_IMPORTED_MODULE_6__util_store__["a" /* Store */].get(this.constants.SESSION_KEY);
        var queryUrl = this.query.getServerUrl() + "/logout?session=" + session;
        return this.http.get(queryUrl)
            .map(function (resp) {
            _this.loggedIn = false;
            _this.userLoggedOutEvent.emit();
        })
            .catch(__WEBPACK_IMPORTED_MODULE_5__util_util__["a" /* Utils */].handleError);
    };
    UserService.prototype.extractUser = function (resp) {
        var body = resp.json();
        try {
            if (body.session == false || body.ok == false) {
                throw new Error(body.comment);
            }
        }
        finally {
            __WEBPACK_IMPORTED_MODULE_6__util_store__["a" /* Store */].put(this.constants.SESSION_KEY, null);
            this.loggedIn = false;
            this.user = null;
        }
        var uploadUrl = this.constants.UPLOAD_PROTOCOL + "://" + body.uploads.address + ":" + body.uploads.port + "/upload";
        this.user = new __WEBPACK_IMPORTED_MODULE_1__model_user_model__["a" /* User */](body.session, body.username, uploadUrl);
        __WEBPACK_IMPORTED_MODULE_6__util_store__["a" /* Store */].put(this.constants.SESSION_KEY, this.user.session);
        return this.user;
    };
    UserService.prototype.getSession = function () {
        return __WEBPACK_IMPORTED_MODULE_6__util_store__["a" /* Store */].get(this.constants.SESSION_KEY);
    };
    return UserService;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
    __metadata("design:type", Object)
], UserService.prototype, "userLoggedInEvent", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
    __metadata("design:type", Object)
], UserService.prototype, "userLoggedOutEvent", void 0);
UserService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_3__angular_http__["b" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__angular_http__["b" /* Http */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_9__roster_service__["a" /* RosterService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_9__roster_service__["a" /* RosterService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_7__query_params_service__["a" /* QueryParamsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_7__query_params_service__["a" /* QueryParamsService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4__shared_constants_service__["a" /* ConstantsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__shared_constants_service__["a" /* ConstantsService */]) === "function" && _d || Object])
], UserService);

var _a, _b, _c, _d;
//# sourceMappingURL=user.service.js.map

/***/ }),

/***/ 357:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(29)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 358:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(29)();
// imports


// module
exports.push([module.i, "footer {\n  background-color: #e6e6e6;\n  width: 100%;\n  overflow: hidden;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 359:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(29)();
// imports


// module
exports.push([module.i, ".navbar {\n  background-color: red;\n  margin-bottom: 40px;\n}\n\n.navbar-brand {\n  color: white;\n}\n\n.link {\n  cursor: pointer;\n  color: white !important;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 360:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(29)();
// imports


// module
exports.push([module.i, ".message {\n  padding: 10px;\n  margin-bottom: 10px;\n  border-radius: 6px;\n}\n\n/* message types */\n.msg-IN {\n  max-width: 70vh;\n  background: rgba(255, 0, 0, 0.4);\n}\n\n.msg-OUT {\n  max-width: 90vh;\n  background: rgba(200, 200, 200, 0.4);\n  float: right;\n  text-align: right;\n}\n\n.msg-SERVICE {\n  background: rgba(130, 200, 125, 0.4);\n  text-align: center;\n  font-size: small;\n  font-style: italic;\n}\n\n/* statuses */\n.check-success, .received.acknowledged .check-success {\n  display: none;\n}\n\n.double-check-success {\n  display: none;\n}\n\n.acknowledged .double-check-success {\n  display: inline-block;\n}\n\n.received .check-success {\n  display: inline-block;\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 361:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(29)();
// imports


// module
exports.push([module.i, ".messages {\n  height: 70vh;\n  overflow: auto;\n}\n\n.messages.hover {\n  background-color: rgba(0, 173, 255, 0.27);\n}\n.messages.drop {\n  background-color: dodgerblue;\n}\n#attachButton.error {\n  background-color: red;\n}\n\n#recordAudioPanel {\n  position: absolute;\n  right: 90px;\n  bottom: 40px;\n  background-color: rgba(128, 128, 128, 0.18);\n  padding: 8px;\n  border-radius: 8px;\n}\n\n#closeRecordAudioPanel {\n  margin-top: 8px;\n  margin-left: 8px;\n  cursor: pointer;\n}\n\n.red, .red:hover, .red:focus {\n  background-color: red;\n}\n\n.nv-file-over {\n  background-color: rgba(14, 238, 35, 0.22);\n}\n\ndiv.contenteditable:empty:before {\n  content: attr(data-placeholder);\n  color: gray;\n  position: absolute;\n  top: 0;\n  left: 0;\n  padding: 6px;\n  width: 100%;\n  height: 100%;\n}\ndiv.contenteditable:empty:after {\n  content: '\\200B';\n}\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 365:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": 124,
	"./af.js": 124,
	"./ar": 131,
	"./ar-dz": 125,
	"./ar-dz.js": 125,
	"./ar-kw": 126,
	"./ar-kw.js": 126,
	"./ar-ly": 127,
	"./ar-ly.js": 127,
	"./ar-ma": 128,
	"./ar-ma.js": 128,
	"./ar-sa": 129,
	"./ar-sa.js": 129,
	"./ar-tn": 130,
	"./ar-tn.js": 130,
	"./ar.js": 131,
	"./az": 132,
	"./az.js": 132,
	"./be": 133,
	"./be.js": 133,
	"./bg": 134,
	"./bg.js": 134,
	"./bn": 135,
	"./bn.js": 135,
	"./bo": 136,
	"./bo.js": 136,
	"./br": 137,
	"./br.js": 137,
	"./bs": 138,
	"./bs.js": 138,
	"./ca": 139,
	"./ca.js": 139,
	"./cs": 140,
	"./cs.js": 140,
	"./cv": 141,
	"./cv.js": 141,
	"./cy": 142,
	"./cy.js": 142,
	"./da": 143,
	"./da.js": 143,
	"./de": 146,
	"./de-at": 144,
	"./de-at.js": 144,
	"./de-ch": 145,
	"./de-ch.js": 145,
	"./de.js": 146,
	"./dv": 147,
	"./dv.js": 147,
	"./el": 148,
	"./el.js": 148,
	"./en-au": 149,
	"./en-au.js": 149,
	"./en-ca": 150,
	"./en-ca.js": 150,
	"./en-gb": 151,
	"./en-gb.js": 151,
	"./en-ie": 152,
	"./en-ie.js": 152,
	"./en-nz": 153,
	"./en-nz.js": 153,
	"./eo": 154,
	"./eo.js": 154,
	"./es": 156,
	"./es-do": 155,
	"./es-do.js": 155,
	"./es.js": 156,
	"./et": 157,
	"./et.js": 157,
	"./eu": 158,
	"./eu.js": 158,
	"./fa": 159,
	"./fa.js": 159,
	"./fi": 160,
	"./fi.js": 160,
	"./fo": 161,
	"./fo.js": 161,
	"./fr": 164,
	"./fr-ca": 162,
	"./fr-ca.js": 162,
	"./fr-ch": 163,
	"./fr-ch.js": 163,
	"./fr.js": 164,
	"./fy": 165,
	"./fy.js": 165,
	"./gd": 166,
	"./gd.js": 166,
	"./gl": 167,
	"./gl.js": 167,
	"./gom-latn": 168,
	"./gom-latn.js": 168,
	"./he": 169,
	"./he.js": 169,
	"./hi": 170,
	"./hi.js": 170,
	"./hr": 171,
	"./hr.js": 171,
	"./hu": 172,
	"./hu.js": 172,
	"./hy-am": 173,
	"./hy-am.js": 173,
	"./id": 174,
	"./id.js": 174,
	"./is": 175,
	"./is.js": 175,
	"./it": 176,
	"./it.js": 176,
	"./ja": 177,
	"./ja.js": 177,
	"./jv": 178,
	"./jv.js": 178,
	"./ka": 179,
	"./ka.js": 179,
	"./kk": 180,
	"./kk.js": 180,
	"./km": 181,
	"./km.js": 181,
	"./kn": 182,
	"./kn.js": 182,
	"./ko": 183,
	"./ko.js": 183,
	"./ky": 184,
	"./ky.js": 184,
	"./lb": 185,
	"./lb.js": 185,
	"./lo": 186,
	"./lo.js": 186,
	"./lt": 187,
	"./lt.js": 187,
	"./lv": 188,
	"./lv.js": 188,
	"./me": 189,
	"./me.js": 189,
	"./mi": 190,
	"./mi.js": 190,
	"./mk": 191,
	"./mk.js": 191,
	"./ml": 192,
	"./ml.js": 192,
	"./mr": 193,
	"./mr.js": 193,
	"./ms": 195,
	"./ms-my": 194,
	"./ms-my.js": 194,
	"./ms.js": 195,
	"./my": 196,
	"./my.js": 196,
	"./nb": 197,
	"./nb.js": 197,
	"./ne": 198,
	"./ne.js": 198,
	"./nl": 200,
	"./nl-be": 199,
	"./nl-be.js": 199,
	"./nl.js": 200,
	"./nn": 201,
	"./nn.js": 201,
	"./pa-in": 202,
	"./pa-in.js": 202,
	"./pl": 203,
	"./pl.js": 203,
	"./pt": 205,
	"./pt-br": 204,
	"./pt-br.js": 204,
	"./pt.js": 205,
	"./ro": 206,
	"./ro.js": 206,
	"./ru": 207,
	"./ru.js": 207,
	"./sd": 208,
	"./sd.js": 208,
	"./se": 209,
	"./se.js": 209,
	"./si": 210,
	"./si.js": 210,
	"./sk": 211,
	"./sk.js": 211,
	"./sl": 212,
	"./sl.js": 212,
	"./sq": 213,
	"./sq.js": 213,
	"./sr": 215,
	"./sr-cyrl": 214,
	"./sr-cyrl.js": 214,
	"./sr.js": 215,
	"./ss": 216,
	"./ss.js": 216,
	"./sv": 217,
	"./sv.js": 217,
	"./sw": 218,
	"./sw.js": 218,
	"./ta": 219,
	"./ta.js": 219,
	"./te": 220,
	"./te.js": 220,
	"./tet": 221,
	"./tet.js": 221,
	"./th": 222,
	"./th.js": 222,
	"./tl-ph": 223,
	"./tl-ph.js": 223,
	"./tlh": 224,
	"./tlh.js": 224,
	"./tr": 225,
	"./tr.js": 225,
	"./tzl": 226,
	"./tzl.js": 226,
	"./tzm": 228,
	"./tzm-latn": 227,
	"./tzm-latn.js": 227,
	"./tzm.js": 228,
	"./uk": 229,
	"./uk.js": 229,
	"./ur": 230,
	"./ur.js": 230,
	"./uz": 232,
	"./uz-latn": 231,
	"./uz-latn.js": 231,
	"./uz.js": 232,
	"./vi": 233,
	"./vi.js": 233,
	"./x-pseudo": 234,
	"./x-pseudo.js": 234,
	"./yo": 235,
	"./yo.js": 235,
	"./zh-cn": 236,
	"./zh-cn.js": 236,
	"./zh-hk": 237,
	"./zh-hk.js": 237,
	"./zh-tw": 238,
	"./zh-tw.js": 238
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 365;


/***/ }),

/***/ 370:
/***/ (function(module, exports) {

module.exports = "<app-header></app-header>\n<router-outlet></router-outlet>\n<app-footer></app-footer>\n"

/***/ }),

/***/ 371:
/***/ (function(module, exports) {

module.exports = "<footer>\n  <p class=\"float-right\">\n    <small>© HABARSHI Ltd.</small>\n  </p>\n</footer>\n"

/***/ }),

/***/ 372:
/***/ (function(module, exports) {

module.exports = "<header>\n  <nav class=\"navbar navbar-toggleable-md navbar-light bg-faded\">\n    <button class=\"navbar-toggler navbar-toggler-right\" type=\"button\" data-toggle=\"collapse\"\n            data-target=\"#navbarSupportedContent\" aria-controls=\"navbarSupportedContent\" aria-expanded=\"false\"\n            aria-label=\"Toggle navigation\">\n      <span class=\"navbar-toggler-icon\"></span>\n    </button>\n    <a class=\"navbar-brand\" href=\"#\">HABARSHI</a>\n\n    <div class=\"collapse navbar-collapse\" id=\"navbarSupportedContent\">\n      <div class=\"d-flex justify-content-end col-md-12\">\n        <div *ngIf=\"!isLoggedIn(); else logoutDiv\" >\n          <a [hidden]=\"anonym != 0 && anonym != 2\" (click)=\"anonym = 1\" class=\"link\">Новый пользователь</a>\n          <a [hidden]=\"anonym != 0 && anonym != 1\" (click)=\"anonym = 2\" class=\"btn btn-secondary\">Уже зарегистрирован</a>\n          <div [ngSwitch]=\"anonym\" style=\"display: inline-block;\">\n            <div *ngSwitchCase=\"1\" class=\"input-group auth-form\">\n              <input #name type=\"text\" name=\"name\" class=\"form-control\" title=\"Имя\"\n                     required=\"required\" placeholder=\"Имя\">\n              <input #fullname type=\"text\" name=\"fullname\" class=\"form-control\" title=\"Фамилия\"\n                     placeholder=\"Фамилия\">\n              <span class=\"input-group-btn\">\n              <button (click)=\"create(name, fullname)\" type=\"submit\"\n                      class=\"btn btn-secondary pull-right\">Создать</button>\n              </span>\n            </div>\n            <div *ngSwitchCase=\"2\" class=\"input-group auth-form\">\n              <input #username type=\"text\" name=\"name\" class=\"form-control\" title=\"Логин\"\n                     required=\"required\" placeholder=\"Логин\">\n              <input #passwd type=\"password\" name=\"passwd\" class=\"form-control\" title=\"Пароль\"\n                     required=\"required\" placeholder=\"Пароль\">\n              <span class=\"input-group-btn\">\n              <button (click)=\"auth(username, passwd)\" type=\"submit\" class=\"btn btn-secondary pull-right\">Войти</button>\n              </span>\n            </div>\n          </div>\n        </div>\n        <ng-template #logoutDiv>\n          <div>\n            <button (click)=\"logout()\" class=\"btn btn-secondary\">Выйти</button>\n          </div>\n        </ng-template>\n      </div>\n    </div>\n  </nav>\n</header>\n"

/***/ }),

/***/ 373:
/***/ (function(module, exports) {

module.exports = "<div style=\"overflow: hidden;\">\n  <div class=\"message {{'msg-' + MessageType[messageType]}} {{message.marker}}\">\n    <p>\n      <b> {{ messageType == MessageType.IN ? fromFull : (messageType == MessageType.OUT ? 'Я' : message.jid) }}</b>\n      {{ message.time | amCalendar }}\n      <span [hidden]=\"messageType == MessageType.SERVICE\">\n        <span class=\"fa-lg check-success\">\n          <i class=\"fa fa-check\" style=\"margin-left:4px\"></i>\n          </span>\n        <span class=\"fa-stack fa-lg double-check-success\">\n          <i class=\"fa fa-check fa-stack-1x\" style=\"margin-left:4px\"></i>\n          <i class=\"fa fa-check  fa-stack-1x\" style=\"margin-left:-4px\"></i>\n        </span>\n      </span>\n    </p>\n    <div [ngSwitch]=\"habarshiMessageType\">\n      <div *ngSwitchCase=\"HabarshiMessage.FILE\">\n        <ng-template [ngIf]=\"habarshiFile.type.startsWith('video/webm')\">\n          <div class=\"audio\">\n            <audio [src]=\"habarshiFile.full_url\" controls></audio>\n          </div>\n        </ng-template>\n        <ng-template [ngIf]=\"habarshiFile.type.startsWith('image')\">\n          <div class=\"image\">\n            <a [href]=\"habarshiFile.full_url\" target=\"_blank\"><img [src]=\"habarshiFile.preview_url\"/></a>\n          </div>\n        </ng-template>\n        <ng-template [ngIf]=\"!habarshiFile.type.startsWith('video/webm') && !habarshiFile.type.startsWith('image')\">\n          <div class=\"doc\">\n            <a [href]=\"habarshiFile.full_url\" target=\"_blank\">{{habarshiFile.file_name}}</a>\n          </div>\n        </ng-template>\n      </div>\n      <div *ngSwitchCase=\"HabarshiMessage.ROBOT\">\n        <div>Пользователь {{fromFull}} {{ habarshiRobot.action == 'bye' ? 'покинул(а)' :\n          (habarshiRobot.action == 'create' ? 'создал' : 'вошел(а) в') }} комнату\n        </div>\n      </div>\n      <div *ngSwitchDefault>\n        <div [innerHTML]=\"message.text\"></div>\n      </div>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ 374:
/***/ (function(module, exports) {

module.exports = "<main class=\"container\">\n  <div class=\"row\">\n    <div class=\"offset-3 col-6\">\n      <div [hidden]=\"!isLoggedIn()\">\n        <div [hidden]=\"messages.length == 0\">\n          <div #messagesRef\n               class=\"form-control messages\"\n               title=\"Сообщения\"\n               ng2FileDrop\n               (focus)=\"onFocus()\"\n               [uploader]=\"uploader\"\n               [ngClass]=\"{'nv-file-over': hasBaseDropZoneOver}\"\n               (fileOver)=\"onFileOver($event)\">\n            <app-message *ngFor=\"let msg of messages\" [message]=\"msg\"></app-message>\n          </div>\n          <div class=\"input-group\">\n            <div #messageRef type=\"text\"\n                 contenteditable=\"true\"\n                 tabindex=\"0\"\n                 class=\"form-control contenteditable\"\n                 (keypress)=\"onSendMessage($event)\"\n                 (blur)=\"onBlur()\"\n                 (focus)=\"onFocus()\"\n                 data-placeholder=\"Введите ваше сообщение\">\n            </div>\n            <span class=\"input-group-btn\">\n            <button (click)=\"onSendAudioMessage()\" class=\"btn btn-default\" [style.background-color]=\"getRed()\"><i\n              class=\"fa fa-microphone\"></i></button>\n        </span>\n            <span class=\"input-group-btn\">\n            <input #uploadFileRef (change)=\"onChangeFileUpload()\" name=\"file\" type=\"file\" class=\"hidden-xs-up \">\n            <button (click)=\"onSelectFile()\" class=\"btn btn-default\">\n                <i id=\"attachIcon\" class=\"fa fa-paperclip\"></i></button>\n        </span>\n            <span class=\"input-group-btn\">\n            <button (click)=\"onSendMessage()\"\n                    class=\"btn btn-primary\"><img src=\"/habarshi-chat-angular4/assets/images/send_amber.png\" class=\"img-fluid\"\n                                                 style=\"width: 19px;\"/></button>\n        </span>\n          </div>\n\n        </div>\n        <div [hidden]=\"messages.length != 0\">\n          Загрузка сообщений…\n        </div>\n      </div>\n      <div [hidden]=\"isLoggedIn()\">\n        Пожалуйста, авторизуйтесь или войдите анонимно…\n      </div>\n    </div>\n  </div>\n</main>\n"

/***/ }),

/***/ 49:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shared_constants_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_store__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_util__ = __webpack_require__(26);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QueryParamsService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var QueryParamsService = (function () {
    function QueryParamsService(constants) {
        this.constants = constants;
    }
    QueryParamsService.prototype.getServerUrl = function () {
        var domain = __WEBPACK_IMPORTED_MODULE_2__util_store__["a" /* Store */].get(this.constants.SERVER_URL);
        if (domain == null) {
            __WEBPACK_IMPORTED_MODULE_3__util_util__["a" /* Utils */].handleError('Некорректная ссылка');
            return;
        }
        return "https://" + domain;
    };
    return QueryParamsService;
}());
QueryParamsService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__shared_constants_service__["a" /* ConstantsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__shared_constants_service__["a" /* ConstantsService */]) === "function" && _a || Object])
], QueryParamsService);

var _a;
//# sourceMappingURL=query-params.service.js.map

/***/ }),

/***/ 50:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Store; });
var Store = (function () {
    function Store() {
    }
    Store.put = function (key, value) {
        if (value == null) {
            localStorage.setItem(key, null);
            return;
        }
        var data = JSON.stringify(value);
        localStorage.setItem(key, data);
    };
    Store.get = function (key) {
        var value = JSON.parse(localStorage.getItem(key));
        if (value === "undefined" || value === "null") {
            return null;
        }
        return value;
    };
    return Store;
}());

//# sourceMappingURL=store.js.map

/***/ }),

/***/ 636:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(283);


/***/ }),

/***/ 66:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MessageType; });
var MessageType;
(function (MessageType) {
    MessageType[MessageType["IN"] = 0] = "IN";
    MessageType[MessageType["OUT"] = 1] = "OUT";
    MessageType[MessageType["SERVICE"] = 2] = "SERVICE";
})(MessageType || (MessageType = {}));
//# sourceMappingURL=message-type.enum.js.map

/***/ }),

/***/ 67:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Message; });
var Message = (function () {
    function Message(from, id, jid, stamp, text, time, to, marker) {
        this.marker = 'markable';
        this.from = from;
        this.id = id;
        this.jid = jid;
        this.marker = marker;
        this.stamp = stamp;
        this.text = text;
        this.time = time;
        this.to = to;
    }
    return Message;
}());

//# sourceMappingURL=message.model.js.map

/***/ }),

/***/ 99:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shared_constants_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash__ = __webpack_require__(363);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_store__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_roster_service__ = __webpack_require__(30);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthGuard; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var AuthGuard = (function () {
    function AuthGuard(rosterService, constants) {
        this.rosterService = rosterService;
        this.constants = constants;
    }
    AuthGuard.prototype.canActivate = function (next, state) {
        // temporally solution
        if (!__WEBPACK_IMPORTED_MODULE_2_lodash__["isEmpty"](next.queryParams)) {
            __WEBPACK_IMPORTED_MODULE_3__util_store__["a" /* Store */].put(this.constants.QUERY_PARAMS, next.queryParams);
            if (next.queryParams.api != null) {
                __WEBPACK_IMPORTED_MODULE_3__util_store__["a" /* Store */].put(this.constants.SERVER_URL, next.queryParams.api);
                this.rosterService.createBuddy();
            }
        }
        return true;
    };
    return AuthGuard;
}());
AuthGuard = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_4__service_roster_service__["a" /* RosterService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__service_roster_service__["a" /* RosterService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__shared_constants_service__["a" /* ConstantsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__shared_constants_service__["a" /* ConstantsService */]) === "function" && _b || Object])
], AuthGuard);

var _a, _b;
//# sourceMappingURL=auth.guard.js.map

/***/ })

},[636]);
//# sourceMappingURL=main.bundle.js.map
