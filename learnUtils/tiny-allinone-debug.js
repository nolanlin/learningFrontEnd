/* 
 * version: 1.5.0-dev1
 * buildTime: 2024/9/25 17:03:31
 */
(function (rt, $t) {
  typeof exports == "object" && typeof module < "u" ? $t(exports) : typeof define == "function" && define.amd ? define(["exports"], $t) : (rt = typeof globalThis < "u" ? globalThis : rt || self, $t(rt["tiny-allinone"] = {}))
})(this, function (rt) {
  "use strict";
  var $t = (a => (a.Annotation = "Annotation", a.GLTF = "gltf", a.TinyAPP = "TinyAPP", a.Empty = "empty", a.TestTemplate = "testTemplate", a))($t || {}),
    Lt = (a => (a.auto = "auto", a.distance = "distance", a.manual = "manual", a.area = "area", a))(Lt || {}),
    ti = (a => (a[a.ERROR = 0] = "ERROR", a[a.WARN = 1] = "WARN", a[a.INFO = 2] = "INFO", a[a.DEBUG = 3] = "DEBUG", a))(ti || {});
  class Ta {
    constructor(e = 2) {
      this.level = e
    }
    setLevel(e) {
      this.level = e
    }
    _log(e = 2, ...s) {
      if (e <= this.level) switch (e) {
        case 0:
          console.error(`[${ti[e]}]`, ...s);
          break;
        case 1:
          console.warn(`[${ti[e]}]`, ...s);
          break;
        case 2:
          console.info(`[${ti[e]}]`, ...s);
          break;
        case 3:
          console.debug(`[${ti[e]}]`, ...s);
          break
      }
    }
    error(...e) {
      this._log(0, ...e)
    }
    warn(...e) {
      this._log(1, ...e)
    }
    info(...e) {
      this._log(2, ...e)
    }
    log(...e) {
      this._log(3, ...e)
    }
  }
  const W = new Ta(2);
  class Ht {
    constructor() {
      this.init = (e, s, o) => {
        this.pc = e, this.app = s, this.loadScriptFromString = o
      }, this.loadTinyApp = (e, s, o) => {
        let h = e.slice(0, e.lastIndexOf("/")),
          u = h.slice(0, h.lastIndexOf("/"));
        console.log(e, h, u, 'this.loadTinyApp');
        return new Promise((p, _) => {
          W.log("loadConfig", e), new Promise((g, k) => {
            console.log(e, 'loadConfig this.loadTinyApp');
            typeof wx < "u" && !wx.isMy ? wx.request({
              url: e,
              method: "GET",
              responseType: "text",
              dataType: "json",
              success: E => {
                const D = E.data;
                g(D)
              },
              fail: E => {
                W.error(E), k(E)
              }
            }) : this.pc.http.get(e, {
              cache: !0
            }, (E, D) => {
              E ? k(E) : g(D)
            })
          }).then(g => {
            o(.1);
            const k = E => {
              o(.1 + E * .85)
            };
            console.log(g, g.assets, 'g.assets this.loadTinyApp');
            this.app.assets.prefix = u + "/", this._loadTinyAppAssets(g.assets, s.assetTag, k).then(() => g.scriptUrl ? this._loadScript(u + "/" + g.scriptUrl, s) : Promise.resolve()).then(() => {
              o(.99);
              let E = new this.pc.Template(this.app, g.template);
              console.log(o, E, p, "_loadTinyAppAssets instantiate")
              o(1), p(E.instantiate())
            }).catch(E => {
              _(E)
            })
          }).catch(g => {
            _(g)
          })
        })
      }, this.loadTemplate = (e, s, o) => new Promise((h, u) => {
        let p = e;
        if (!p) {
          u("asset is null");
          return
        }
        p.loaded ? (o(1), h(p.resource.instantiate())) : (this.app.assets.load(p), p.once("load", () => {
          o(1), h(p.resource.instantiate())
        }))
      }), this.loadGltf = (e, s, o) => new Promise((h, u) => {
        let p = this._generateId(e),
          _ = this.app.assets.get(p),
          g = e.slice(e.lastIndexOf("/") + 1);
        if (_ || (_ = new this.pc.Asset(g, "container", {
            url: e
          }), _.id = p, this.app.assets.add(_)), _.tags.add(s.assetTag), _.loaded) {
          let k = new this.pc.Entity;
          k.name = g, k.addComponent("model", {
            type: "asset",
            asset: _.resource.model
          }), o(1), h(k)
        } else {
          let k = !1;
          _.once("load", E => {
            if (k) return;
            k = !0;
            let D = new this.pc.Entity;
            D.name = g, D.addComponent("model", {
              type: "asset",
              asset: E.resource.model
            });
            let B = [];
            E.resource.animations && E.resource.animations.length > 0 && (E.resource.animations.forEach(O => {
              O.name = O.resource.name, B.push(O.id)
            }), D.addComponent("animation", {
              activate: !0,
              assets: B,
              loop: !0
            })), o(1), h(D)
          }), _.once("error", E => {
            u(E)
          }), this.app.assets.load(_)
        }
      }), this.unloadTinyApp = e => {
        let s = this.app.assets.findByTag(e);
        for (let o = 0; o < s.length; o++) s[o].tags.remove(e), s[o].tags.list().length == 0 && (s[o].loaded ? (s[o].unload(), this.app.assets.remove(s[o])) : s[o].loading && (s[o].off("load"), s[o].unload(), this.app.assets.remove(s[o])))
      }, this._cachedScript = []
    }
    static get Instance() {
      return this._instance || (this._instance = new this)
    }
    _loadTinyAppAssets(e, s, o) {
      return new Promise((h, u) => {
        console.log(e, '_loadTinyAppAssets');
        let p = 0,
          _ = Object.keys(e).length;
        for (let g in e) {
          let k = this.app.assets.get(Number.parseInt(e[g].id));
          k || (k = new this.pc.Asset(e[g].name, e[g].type, e[g].file, e[g].data), k.id = e[g].id, this.app.assets.add(k)), k.tags.add(s), k.loaded ? (p++, o(p / _), p >= _ && h(null)) : (k.once("load", () => {
            p++, o(p / _), p >= _ && h(null)
          }), k.once("error", E => {
            u(E)
          }), this.app.assets.load(k))
        }
        _ == 0 && h(null)
      })
    }
    _loadScript(e, s) {
      return new Promise((o, h) => {
        if (this._cachedScript.indexOf(e) >= 0) {
          o(null);
          return
        }
        this.pc.http.get(e, {
          cache: !0,
          responseType: "text"
        }, (u, p) => {
          if (u) h(u);
          else {
            const _ = {
              console,
              pc: this.pc,
              app: this.app,
              wx: typeof wx < "u" ? wx : null,
              my: typeof my < "u" ? my : null,
              setTimeout,
              setInterval,
              clearTimeout,
              clearInterval,
              Float32Array,
              $TinyLoader: Ht.Instance,
              $TinyLuncher: Pt.Instance,
              $GetTinyRoot: function (g) {
                return ke.call(g)
              }
            };
            typeof window < "u" && document && document.body ? (new Function(...Object.keys(_), p)(...Object.values(_)), this._cachedScript.push(e), o(null)) : this.loadScriptFromString ? (this.loadScriptFromString(p, _), this._cachedScript.push(e), o(null)) : (W.warn("loadScriptFromString is null"), o(null))
          }
        })
      })
    }
    _generateId(e) {
      let s = 5381;
      for (let o = 0; o < e.length; o++) s = s * 33 ^ e.charCodeAt(o);
      return s >>> 0
    }
    release() {
      Ht._instance = null
    }
  }

  function Ra(a, e) {
    if (!a) throw new Error("entity is null!");
    if (!Pt.Instance.inited) throw new Error("TinyLuncher is not inited!");
    if (e) {
      const s = e.type.toLowerCase();
      switch (s) {
        case $t.Annotation.toLowerCase():
          return new zi(a, e);
        case $t.TinyAPP.toLowerCase():
          return new mi(a, e);
        case $t.TestTemplate.toLowerCase():
          return new mi(a, e);
        case $t.GLTF.toLowerCase():
          return new mi(a, e);
        case $t.Empty.toLowerCase():
          return new Le(a, e);
        default:
          return W.error("\u672A\u77E5\u7684 TinyRoot \u7C7B\u578B:", s), new Le(a, e)
      }
    }
    return new Le(a)
  }
  class Le {
    constructor(e, s) {
      if (this.children = [], this._inited = !1, this._loading = !1, this._loaded = !1, this._active = !1, !e) throw new Error("entity is null!");
      if (!Pt.Instance.inited) throw new Error("TinyLuncher is not inited!");
      if (this.pc = Pt.Instance.pc, this.app = Pt.Instance.app, this.camera = Pt.Instance.camera, this.rootEntity = e, s) {
        if (s.externalData && typeof s.externalData == "string") try {
          s.externalData = JSON.parse(s.externalData)
        } catch (o) {
          W.error(o)
        }
        this.externalData = s.externalData, this.rawData = s, s.type === "empty" && (W.log("init tinyRoot from empty"), this.inited = !0, this.loaded = !0, this.active = !0)
      }
    }
    get assetTag() {
      return this.rootEntity.getGuid()
    }
    set inited(e) {
      this._inited !== e && (this._inited = e, this.fire("inited", this))
    }
    set loading(e) {
      this._loading !== e && (this._loading = e, e && this.fire("start_load", this))
    }
    set loaded(e) {
      this._loaded !== e && (this._loaded = e, e ? this.fire("loaded", this) : this.fire("unloaded", this))
    }
    set active(e) {
      this._active !== e && (W.log("set active:", e, ":", this.rootEntity.name), this._active = e, this.fire("active", this, e))
    }
    get loading() {
      return this._loading
    }
    get loaded() {
      return this._loaded
    }
    get active() {
      return this._active
    }
    get inited() {
      return this._inited
    }
    load(e) {}
    setActive(e) {
      this._active !== e && (e ? this.rootEntity.children.forEach(s => {
        s.enabled = !0
      }) : this.rootEntity.children.forEach(s => {
        s.enabled = !1
      }), this.active = e)
    }
    unLoad() {
      !this._loaded || (this.children.forEach(e => {
        Pt.Instance.removeTinyRoot(e.rootEntity)
      }), this.rootEntity.children.forEach(e => {
        e.destroy()
      }), Ht.Instance.unloadTinyApp(this.assetTag), W.log(`unLoad ${this.rootEntity.name}`), this.loaded = !1)
    }
    destroy() {
      Pt.Instance.removeTinyRoot(this.rootEntity)
    }
    _addRootHandlerScript(e = this.rootEntity, s = this.rawData) {
      setTimeout(() => {
        e.script || e.addComponent("script"), e.script.has("sdsTinyRootHandler") || (W.log("\u6DFB\u52A0 sdsTinyRootHandler \u811A\u672C\u5230\uFF1A", e.name), e.script.create("sdsTinyRootHandler", {
          attributes: s
        }))
      })
    }
    on(e, s, o) {
      this.rootEntity.on(e, s, o)
    }
    off(e, s, o) {
      this.rootEntity.off(e, s, o)
    }
    once(e, s, o) {
      this.rootEntity.once(e, s, o)
    }
    fire(e, ...s) {
      this.rootEntity.fire(e, ...s)
    }
  }
  class mi extends Le {
    constructor(e, s) {
      if (super(e, s), this._currentAnimName = "", s) switch ((!e.script || !e.script.has("sdsTinyRootHandler")) && this._addRootHandlerScript(), this.inited = !0, s.type.toLowerCase()) {
        case "tinyapp":
          W.log("init tinyRoot from TinyAPP");
          break;
        case "testtemplate":
          W.log("init tinyRoot from testTemplate");
          break;
        case "gltf":
          W.log("init tinyRoot from gltf");
          break
      }
    }
    load(e) {
      if (super.load(e), this._loading || this._loaded) return;
      let s = null,
        o = u => {
          this.fire("load_prograss", u, this)
        },
        h = this.rawData.tinyAppUrl ? this.rawData.tinyAppUrl : this.rawData.url;
      switch (this.rawData.type.toLowerCase()) {
        case "tinyapp":
          if (!h || h === "") throw W.error("tinyAppUrl is null or empty.bind entity name is:", this.rootEntity.name), new Error("tinyAppUrl is null or empty");
          if (!h.endsWith(".json")) throw W.error("tinyAppUrl is not end with .json"), new Error("tinyAppUrl is not end with .json");
          this.loading = !0, s = Ht.Instance.loadTinyApp(h, this, o);
          break;
        case "testtemplate":
          this.loading = !0, s = Ht.Instance.loadTemplate(this.rawData.template, this, o);
          break;
        case "gltf":
          if (!h || h === "") throw W.error("tinyAppUrl is null or empty.bind entity name is:", this.rootEntity.name), new Error("tinyAppUrl is null or empty");
          if (!(h.toLowerCase().endsWith(".glb") || h.toLowerCase().endsWith(".gltf"))) throw W.error("tinyAppUrl is not end with .glb or .gltf"), new Error("tinyAppUrl is not end with .glb or .gltf");
          this.loading = !0, s = Ht.Instance.loadGltf(this.rawData.tinyAppUrl ? this.rawData.tinyAppUrl : this.rawData.url, this, o);
          break
      }
      s.then(u => {
        var p;
        this.loaded || (u.enabled = !1, this.rootEntity.addChild(u), u.setLocalPosition(0, 0, 0), u.setLocalEulerAngles(0, 0, 0), this._modelRoot = u, W.log("load over:", this.rootEntity.name), this.loading = !1, this.loaded = !0, this.active ? u.enabled = !0 : this.rawData.showCondition == "auto" && (W.log(`auto show ${this.rootEntity.name}`), this.active = !0, u.enabled = !0), (p = this.externalData) != null && p.clickable && (u.script || u.addComponent("script"), u.script.has("sdsClickable") || (W.log("\u6DFB\u52A0 sdsClickable \u811A\u672C\u5230\uFF1A", u.name), u.script.create("sdsClickable"))), u.animation && (this._animation = u.animation), e && e(null))
      }).catch(u => {
        W.error(u), this._loading = !1, e && e(u)
      })
    }
    get animation() {
      return this._animation || W.warn(`${this._modelRoot.name} entity has no animation component`), this._animation
    }
    playAnimation(e, s) {
      if (!this._animation) {
        W.warn(`${this._modelRoot.name} entity has no animation component`);
        return
      }
      this._animation.speed = 1, this._currentAnimName !== e && (this._animation.currentTime = 0, this._animation.play(e, s), this._currentAnimName = e)
    }
    stopAnimation() {
      if (!this._animation) {
        W.warn(`${this._modelRoot.name} entity has no animation component`);
        return
      }
      this._animation.speed = 0
    }
  }
  class zi extends Le {
    constructor(e, s) {
      super(e, s), s && s.type === "Annotation" && (W.log("init tinyRoot from Annotation"), this._createEntitysFromAnnotation(s.ema), this.inited = !0, this.loaded = !0, this.active = !0)
    }
    _createEntitysFromAnnotation(e) {
      e.blocks.forEach(s => {
        const o = new this.pc.Entity(s.id);
        o.setGuid(s.id), o.setPosition(s.transform.position.x, s.transform.position.y, s.transform.position.z), o.setRotation(s.transform.rotation.x, s.transform.rotation.y, s.transform.rotation.z, s.transform.rotation.w), o.setLocalScale(s.transform.scale.x, s.transform.scale.y, s.transform.scale.z), this.rootEntity.addChild(o), this.app.fire("rejesterBlock", o.name, o)
      }), e.annotations.forEach(s => {
        if (s.type != "node") return;
        const o = new this.pc.Entity(s.properties.name);
        o.setGuid(s.id);
        let h = s.localTransform ? s.localTransform : s.transform;
        if (o.setLocalPosition(h.position.x, h.position.y, h.position.z), s.geometry === "cube" ? (o.setLocalRotation(h.rotation.x, h.rotation.y, h.rotation.z, h.rotation.w), o.setLocalScale(h.scale.x, h.scale.y, h.scale.z), this.externalData && this.externalData.show && o.addComponent("render", {
            enabled: !0,
            type: "box"
          }), o.name.toLowerCase().startsWith("mask") && (o.render || o.addComponent("render", {
            enabled: !0,
            type: "box"
          }), o.script || o.addComponent("script"), o.script.has("sdsMask") || (W.log("\u6DFB\u52A0 sdsMask \u811A\u672C\u5230\uFF1A", o.name), o.script.create("sdsMask"))), o.name.toLowerCase().startsWith("area") && (o.script || o.addComponent("script"), o.script.has("sdsMarkArea") || (W.log("\u6DFB\u52A0 sdsMarkArea \u811A\u672C\u5230\uFF1A", o.name), o.script.create("sdsMarkArea")))) : (this.externalData && this.externalData.show && o.addComponent("render", {
            enabled: !0,
            type: "sphere"
          }), o.setLocalScale(.2, .2, .2)), s.properties["wenlv:tinyapp"]) {
          W.log("\u53D1\u73B0 tinyapp \u4FE1\u606F");
          const u = s.properties["wenlv:tinyapp"];
          this._addRootHandlerScript(o, u)
        }
        this.rootEntity.findByGuid(s.parent.id).addChild(o)
      })
    }
  }
  const ke = function () {
    if (this.entity) {
      if (this.__tr) return this.__tr;
      let a = this.entity.parent,
        e;
      for (; !(a.name == "Root" || (e = Pt.Instance.findTinyRoot(a), e));) a = a.parent;
      return this.__tr = e, e
    }
  };

  function Ia(a, e) {
    class s extends a.ScriptType {
      constructor() {
        super(...arguments), this._nextCheckTimer = 0
      }
      initialize() {
        let h = {
          type: this.type,
          tinyAppUrl: this.tinyAppUrl,
          template: this.testTemplate,
          loadCondition: this.loadCondition,
          loadDistance: this.loadDistance,
          loadAreas: this.loadAreas,
          showCondition: this.showCondition,
          showDistance: this.showDistance,
          showAreas: this.showAreas,
          externalData: this.externalData
        };
        this.tinyRoot = Pt.Instance.findTinyRoot(this.entity), this.tinyRoot || (W.log("sdsRootHandler \u521B\u5EFA TinyRoot,entity:", this.entity.name), this.tinyRoot = Pt.Instance.instantiateFromTinyApp(h, this.entity, ke.call(this))), this.loadCondition == Lt.auto && !this.tinyRoot.loaded && !this.tinyRoot.loading && this.tinyRoot.load(), (this.loadCondition == Lt.area || this.showCondition == Lt.area) && (this.app.on("enter_area", this.onEnterArea, this), this.app.on("exit_area", this.onExitArea, this), this.on("destroy", () => {
          this.app.off("enter_area", this.onEnterArea, this), this.app.off("exit_area", this.onExitArea, this)
        }))
      }
      onEnterArea(h) {
        this.loadCondition == Lt.area && this.loadAreas && this.loadAreas.includes(h) && !this.tinyRoot.loaded && !this.tinyRoot.loading && this.tinyRoot.load(), this.showCondition == Lt.area && this.showAreas && this.showAreas.includes(h) && this.tinyRoot.setActive(!0)
      }
      onExitArea(h) {
        this.loadCondition == Lt.area && this.loadAreas && this.loadAreas.includes(h) && this.tinyRoot.loaded && this.tinyRoot.unLoad(), this.showCondition == Lt.area && this.showAreas && this.showAreas.includes(h) && this.tinyRoot.setActive(!1)
      }
      update(h) {
        if (!this.tinyRoot || (this.loadCondition == Lt.auto || this.loadCondition == Lt.manual) && (this.showCondition == Lt.auto || this.showCondition == Lt.manual) || (this._nextCheckTimer -= h, this._nextCheckTimer > 0)) return;
        let u = this.entity.getPosition().clone().sub(this.tinyRoot.camera.getPosition().clone()).lengthSq();
        this.loadCondition == Lt.distance && (!this.tinyRoot.loaded && !this.tinyRoot.loading && u < Math.pow(this.loadDistance, 2) ? this.tinyRoot.load() : this.tinyRoot.loaded && u > Math.pow(this.loadDistance, 2) && this.tinyRoot.unLoad()), this.tinyRoot.loaded && this.showCondition == Lt.distance && (!this.tinyRoot.active && u < Math.pow(this.showDistance, 2) ? this.tinyRoot.setActive(!0) : this.tinyRoot.active && u > Math.pow(this.showDistance, 2) && this.tinyRoot.setActive(!1));
        let p = Math.sqrt(u);
        this._nextCheckTimer = p / 10
      }
    }
    a.registerScript(s, "sdsTinyRootHandler", e), s.attributes.add("type", {
      type: "string",
      default: "TinyAPP",
      enum: [{
        TinyAPP: "TinyAPP"
      }, {
        testTemplate: "testTemplate"
      }, {
        gltf: "gltf"
      }]
    }), s.attributes.add("testTemplate", {
      type: "asset",
      assetType: "template",
      default: null
    }), s.attributes.add("tinyAppUrl", {
      type: "string",
      default: ""
    }), s.attributes.add("loadCondition", {
      type: "string",
      default: "manual",
      enum: [{
        auto: "auto"
      }, {
        distance: "distance"
      }, {
        manual: "manual"
      }, {
        area: "area"
      }],
      description: "auto: \u81EA\u52A8\u52A0\u8F7D; distance: \u6839\u636E\u8DDD\u79BB\u52A0\u8F7D; manual: \u624B\u52A8\u52A0\u8F7D;area: \u76F8\u673A\u8FDB\u5165\u67D0\u533A\u57DF\u65F6\u52A0\u8F7D;"
    }), s.attributes.add("loadDistance", {
      type: "number",
      default: 5
    }), s.attributes.add("loadAreas", {
      type: "string",
      array: !0
    }), s.attributes.add("showCondition", {
      type: "string",
      default: "manual",
      enum: [{
        auto: "auto"
      }, {
        distance: "distance"
      }, {
        manual: "manual"
      }, {
        area: "area"
      }],
      description: "auto: \u81EA\u52A8\u663E\u793A; distance: \u6839\u636E\u8DDD\u79BB\u663E\u793A; manual: \u624B\u52A8\u663E\u793A;area: \u76F8\u673A\u8FDB\u5165\u67D0\u533A\u57DF\u65F6\u663E\u793A;"
    }), s.attributes.add("showDistance", {
      type: "number",
      default: 3
    }), s.attributes.add("showAreas", {
      type: "string",
      array: !0
    }), s.attributes.add("externalData", {
      type: "string",
      default: ""
    })
  }

  function Ca(a) {
    a.extend(a, function () {
        var s = function (b) {
          this._app = b, this._tweens = [], this._add = []
        };
        s.prototype = {
          add: function (b) {
            return this._add.push(b), b
          },
          update: function (b) {
            for (var J = 0, pt = this._tweens.length; J < pt;) this._tweens[J].update(b) ? J++ : (this._tweens.splice(J, 1), pt--);
            if (this._add.length) {
              for (var J = 0; J < this._add.length; J++) this._tweens.indexOf(this._add[J]) > -1 || this._tweens.push(this._add[J]);
              this._add.length = 0
            }
          }
        };
        var o = function (b, J, pt) {
            a.events.attach(this), this.manager = J, pt && (this.entity = null), this.time = 0, this.complete = !1, this.playing = !1, this.stopped = !0, this.pending = !1, this.target = b, this.duration = 0, this._currentDelay = 0, this.timeScale = 1, this._reverse = !1, this._delay = 0, this._yoyo = !1, this._count = 0, this._numRepeats = 0, this._repeatDelay = 0, this._from = !1, this._slerp = !1, this._fromQuat = new a.Quat, this._toQuat = new a.Quat, this._quat = new a.Quat, this.easing = a.Linear, this._sv = {}, this._ev = {}
          },
          h = function (b) {
            var J;
            return b instanceof a.Vec2 ? J = {
              x: b.x,
              y: b.y
            } : b instanceof a.Vec3 ? J = {
              x: b.x,
              y: b.y,
              z: b.z
            } : b instanceof a.Vec4 ? J = {
              x: b.x,
              y: b.y,
              z: b.z,
              w: b.w
            } : b instanceof a.Quat ? J = {
              x: b.x,
              y: b.y,
              z: b.z,
              w: b.w
            } : b instanceof a.Color ? (J = {
              r: b.r,
              g: b.g,
              b: b.b
            }, b.a !== void 0 && (J.a = b.a)) : J = b, J
          };
        o.prototype = {
          to: function (b, J, pt, St, Wt, Qt) {
            return this._properties = h(b), this.duration = J, pt && (this.easing = pt), St && this.delay(St), Wt && this.repeat(Wt), Qt && this.yoyo(Qt), this
          },
          from: function (b, J, pt, St, Wt, Qt) {
            return this._properties = h(b), this.duration = J, pt && (this.easing = pt), St && this.delay(St), Wt && this.repeat(Wt), Qt && this.yoyo(Qt), this._from = !0, this
          },
          rotate: function (b, J, pt, St, Wt, Qt) {
            return this._properties = h(b), this.duration = J, pt && (this.easing = pt), St && this.delay(St), Wt && this.repeat(Wt), Qt && this.yoyo(Qt), this._slerp = !0, this
          },
          start: function () {
            var b, J, pt, St;
            if (this.playing = !0, this.complete = !1, this.stopped = !1, this._count = 0, this.pending = this._delay > 0, this._reverse && !this.pending ? this.time = this.duration : this.time = 0, this._from) {
              for (b in this._properties) this._properties.hasOwnProperty(b) && (this._sv[b] = this._properties[b], this._ev[b] = this.target[b]);
              this._slerp && (this._toQuat.setFromEulerAngles(this.target.x, this.target.y, this.target.z), J = this._properties.x !== void 0 ? this._properties.x : this.target.x, pt = this._properties.y !== void 0 ? this._properties.y : this.target.y, St = this._properties.z !== void 0 ? this._properties.z : this.target.z, this._fromQuat.setFromEulerAngles(J, pt, St))
            } else {
              for (b in this._properties) this._properties.hasOwnProperty(b) && (this._sv[b] = this.target[b], this._ev[b] = this._properties[b]);
              this._slerp && (J = this._properties.x !== void 0 ? this._properties.x : this.target.x, pt = this._properties.y !== void 0 ? this._properties.y : this.target.y, St = this._properties.z !== void 0 ? this._properties.z : this.target.z, this._properties.w !== void 0 ? (this._fromQuat.copy(this.target), this._toQuat.set(J, pt, St, this._properties.w)) : (this._fromQuat.setFromEulerAngles(this.target.x, this.target.y, this.target.z), this._toQuat.setFromEulerAngles(J, pt, St)))
            }
            return this._currentDelay = this._delay, this.manager.add(this), this.fire("start"), this
          },
          pause: function () {
            this.playing = !1, this.fire("pause")
          },
          resume: function () {
            this.playing = !0
          },
          stop: function () {
            this.playing = !1, this.stopped = !0, this.fire("stop")
          },
          delay: function (b) {
            return this._delay = b, this.pending = !0, this
          },
          repeat: function (b, J) {
            return this._count = 0, this._numRepeats = b, J ? this._repeatDelay = J : this._repeatDelay = 0, this
          },
          loop: function (b) {
            return b ? (this._count = 0, this._numRepeats = 1 / 0) : this._numRepeats = 0, this
          },
          yoyo: function (b) {
            return this._yoyo = b, this
          },
          reverse: function () {
            return this._reverse = !this._reverse, this
          },
          chain: function () {
            for (var b = arguments.length; b--;) b > 0 ? arguments[b - 1]._chained = arguments[b] : this._chained = arguments[b];
            return this
          },
          update: function (b) {
            if (this.stopped) return !1;
            if (!this.playing) return !0;
            if (!this._reverse || this.pending ? this.time += b * this.timeScale : this.time -= b * this.timeScale, this.pending)
              if (this.time > this._currentDelay) this._reverse ? this.time = this.duration - (this.time - this._currentDelay) : this.time -= this._currentDelay, this.pending = !1;
              else return !0;
            var J = 0;
            (!this._reverse && this.time > this.duration || this._reverse && this.time < 0) && (this._count++, this.complete = !0, this.playing = !1, this._reverse ? (J = this.duration - this.time, this.time = 0) : (J = this.time - this.duration, this.time = this.duration));
            var pt = this.duration === 0 ? 1 : this.time / this.duration,
              St = this.easing(pt),
              Wt, Qt;
            for (var Pe in this._properties) this._properties.hasOwnProperty(Pe) && (Wt = this._sv[Pe], Qt = this._ev[Pe], this.target[Pe] = Wt + (Qt - Wt) * St);
            if (this._slerp && this._quat.slerp(this._fromQuat, this._toQuat, St), this.entity && (this.entity._dirtifyLocal(), this.element && this.entity.element && (this.entity.element[this.element] = this.target), this._slerp && this.entity.setLocalRotation(this._quat)), this.fire("update", b), this.complete) {
              var Fe = this._repeat(J);
              return Fe ? this.fire("loop") : (this.fire("complete", J), this.entity && this.entity.off("destroy", this.stop, this), this._chained && this._chained.start()), Fe
            }
            return !0
          },
          _repeat: function (b) {
            if (this._count < this._numRepeats) {
              if (this._reverse ? this.time = this.duration - b : this.time = b, this.complete = !1, this.playing = !0, this._currentDelay = this._repeatDelay, this.pending = !0, this._yoyo) {
                for (var J in this._properties) {
                  var pt = this._sv[J];
                  this._sv[J] = this._ev[J], this._ev[J] = pt
                }
                this._slerp && (this._quat.copy(this._fromQuat), this._fromQuat.copy(this._toQuat), this._toQuat.copy(this._quat))
              }
              return !0
            }
            return !1
          }
        };
        var u = function (b) {
            return b
          },
          p = function (b) {
            return b * b
          },
          _ = function (b) {
            return b * (2 - b)
          },
          g = function (b) {
            return (b *= 2) < 1 ? .5 * b * b : -.5 * (--b * (b - 2) - 1)
          },
          k = function (b) {
            return b * b * b
          },
          E = function (b) {
            return --b * b * b + 1
          },
          D = function (b) {
            return (b *= 2) < 1 ? .5 * b * b * b : .5 * ((b -= 2) * b * b + 2)
          },
          B = function (b) {
            return b * b * b * b
          },
          O = function (b) {
            return 1 - --b * b * b * b
          },
          H = function (b) {
            return (b *= 2) < 1 ? .5 * b * b * b * b : -.5 * ((b -= 2) * b * b * b - 2)
          },
          Q = function (b) {
            return b * b * b * b * b
          },
          it = function (b) {
            return --b * b * b * b * b + 1
          },
          V = function (b) {
            return (b *= 2) < 1 ? .5 * b * b * b * b * b : .5 * ((b -= 2) * b * b * b * b + 2)
          },
          nt = function (b) {
            return b === 0 ? 0 : b === 1 ? 1 : 1 - Math.cos(b * Math.PI / 2)
          },
          ct = function (b) {
            return b === 0 ? 0 : b === 1 ? 1 : Math.sin(b * Math.PI / 2)
          },
          Ct = function (b) {
            return b === 0 ? 0 : b === 1 ? 1 : .5 * (1 - Math.cos(Math.PI * b))
          },
          yt = function (b) {
            return b === 0 ? 0 : Math.pow(1024, b - 1)
          },
          st = function (b) {
            return b === 1 ? 1 : 1 - Math.pow(2, -10 * b)
          },
          et = function (b) {
            return b === 0 ? 0 : b === 1 ? 1 : (b *= 2) < 1 ? .5 * Math.pow(1024, b - 1) : .5 * (-Math.pow(2, -10 * (b - 1)) + 2)
          },
          Rt = function (b) {
            return 1 - Math.sqrt(1 - b * b)
          },
          Vt = function (b) {
            return Math.sqrt(1 - --b * b)
          },
          Et = function (b) {
            return (b *= 2) < 1 ? -.5 * (Math.sqrt(1 - b * b) - 1) : .5 * (Math.sqrt(1 - (b -= 2) * b) + 1)
          },
          qt = function (b) {
            var J, pt = .1,
              St = .4;
            return b === 0 ? 0 : b === 1 ? 1 : (!pt || pt < 1 ? (pt = 1, J = St / 4) : J = St * Math.asin(1 / pt) / (2 * Math.PI), -(pt * Math.pow(2, 10 * (b -= 1)) * Math.sin((b - J) * (2 * Math.PI) / St)))
          },
          kt = function (b) {
            var J, pt = .1,
              St = .4;
            return b === 0 ? 0 : b === 1 ? 1 : (!pt || pt < 1 ? (pt = 1, J = St / 4) : J = St * Math.asin(1 / pt) / (2 * Math.PI), pt * Math.pow(2, -10 * b) * Math.sin((b - J) * (2 * Math.PI) / St) + 1)
          },
          ye = function (b) {
            var J, pt = .1,
              St = .4;
            return b === 0 ? 0 : b === 1 ? 1 : (!pt || pt < 1 ? (pt = 1, J = St / 4) : J = St * Math.asin(1 / pt) / (2 * Math.PI), (b *= 2) < 1 ? -.5 * (pt * Math.pow(2, 10 * (b -= 1)) * Math.sin((b - J) * (2 * Math.PI) / St)) : pt * Math.pow(2, -10 * (b -= 1)) * Math.sin((b - J) * (2 * Math.PI) / St) * .5 + 1)
          },
          _t = function (b) {
            var J = 1.70158;
            return b * b * ((J + 1) * b - J)
          },
          We = function (b) {
            var J = 1.70158;
            return --b * b * ((J + 1) * b + J) + 1
          },
          Ke = function (b) {
            var J = 2.5949095;
            return (b *= 2) < 1 ? .5 * (b * b * ((J + 1) * b - J)) : .5 * ((b -= 2) * b * ((J + 1) * b + J) + 2)
          },
          si = function (b) {
            return b < 1 / 2.75 ? 7.5625 * b * b : b < 2 / 2.75 ? 7.5625 * (b -= 1.5 / 2.75) * b + .75 : b < 2.5 / 2.75 ? 7.5625 * (b -= 2.25 / 2.75) * b + .9375 : 7.5625 * (b -= 2.625 / 2.75) * b + .984375
          },
          Xt = function (b) {
            return 1 - si(1 - b)
          },
          Bt = function (b) {
            return b < .5 ? Xt(b * 2) * .5 : si(b * 2 - 1) * .5 + .5
          };
        return {
          TweenManager: s,
          Tween: o,
          Linear: u,
          QuadraticIn: p,
          QuadraticOut: _,
          QuadraticInOut: g,
          CubicIn: k,
          CubicOut: E,
          CubicInOut: D,
          QuarticIn: B,
          QuarticOut: O,
          QuarticInOut: H,
          QuinticIn: Q,
          QuinticOut: it,
          QuinticInOut: V,
          SineIn: nt,
          SineOut: ct,
          SineInOut: Ct,
          ExponentialIn: yt,
          ExponentialOut: st,
          ExponentialInOut: et,
          CircularIn: Rt,
          CircularOut: Vt,
          CircularInOut: Et,
          BackIn: _t,
          BackOut: We,
          BackInOut: Ke,
          BounceIn: Xt,
          BounceOut: si,
          BounceInOut: Bt,
          ElasticIn: qt,
          ElasticOut: kt,
          ElasticInOut: ye
        }
      }()),
      function () {
        var s = a.version.split(".");
        if (Number.parseInt(s[0]) < 1 || Number.parseInt(s[0]) === 1 && Number.parseInt(s[1]) < 60) {
          a.Application.prototype.addTweenManager = function () {
            this._tweenManager = new a.TweenManager(this), this.on("update", function (u) {
              this._tweenManager.update(u)
            })
          }, a.Application.prototype.tween = function (u) {
            return new a.Tween(u, this._tweenManager)
          }, a.Entity.prototype.tween = function (u, p) {
            var _ = this._app.tween(u);
            return _.entity = this, this.once("destroy", _.stop, _), p && p.element && (_.element = p.element), _
          };
          var o = a.Application.getApplication();
          o && o.addTweenManager()
        } else {
          a.AppBase.prototype.addTweenManager = function () {
            this._tweenManager = new a.TweenManager(this), this.on("update", function (u) {
              this._tweenManager.update(u)
            })
          }, a.AppBase.prototype.tween = function (u) {
            return new a.Tween(u, this._tweenManager)
          }, a.Entity.prototype.tween = function (u, p) {
            var _ = this._app.tween(u);
            return _.entity = this, this.once("destroy", _.stop, _), p && p.element && (_.element = p.element), _
          };
          var h = a.AppBase.getApplication();
          h && h.addTweenManager()
        }
      }();
    var e = a.createScript("sdstween");
    e.attributes.add("tweens", {
      type: "json",
      schema: [{
        name: "autoPlay",
        title: "Autoplay",
        description: "Play tween immediately.",
        type: "boolean",
        default: !1
      }, {
        name: "event",
        title: "Trigger Event",
        description: "Play tween on the specified event name. This event must be fired on the global application object (e.g. this.app.fire('eventname');).",
        type: "string"
      }, {
        name: "path",
        title: "Path",
        description: "The path from the entity to the property. e.g. 'light.color', 'camera.fov' or 'script.vehicle.speed'.",
        type: "string"
      }, {
        name: "start",
        title: "Start",
        type: "vec4"
      }, {
        name: "end",
        title: "End",
        type: "vec4"
      }, {
        name: "easingFunction",
        title: "Easing Function",
        description: "The easing functions: Linear, Quadratic, Cubic, Quartic, Quintic, Sinusoidal, Exponential, Circular, Elastic, Back and Bounce.",
        type: "number",
        enum: [{
          Linear: 0
        }, {
          Quadratic: 1
        }, {
          Cubic: 2
        }, {
          Quartic: 3
        }, {
          Quintic: 4
        }, {
          Sine: 5
        }, {
          Exponential: 6
        }, {
          Circular: 7
        }, {
          Elastic: 8
        }, {
          Back: 9
        }, {
          Bounce: 10
        }],
        default: 0
      }, {
        name: "easingType",
        title: "Easing Type",
        description: "Whether to ease in, easy out or ease in and then out using the specified easing function. Note that for a Linear easing function, the easing type is ignored.",
        type: "number",
        enum: [{
          In: 0
        }, {
          Out: 1
        }, {
          InOut: 2
        }],
        default: 0
      }, {
        name: "delay",
        title: "Delay",
        description: "Time to wait in milliseconds after receiving the trigger event before executing the tween. Defaults to 0.",
        type: "number",
        default: 0
      }, {
        name: "duration",
        title: "Duration",
        description: "Time to execute the tween in milliseconds. Defaults to 1000.",
        type: "number",
        default: 1e3
      }, {
        name: "repeat",
        title: "Repeat",
        description: "The number of times the tween should be repeated after the initial playback. -1 will repeat forever. Defaults to 0.",
        type: "number",
        default: 0
      }, {
        name: "repeatDelay",
        title: "Repeat Delay",
        description: "Time to wait in milliseconds before executing each repeat of the tween. Defaults to 0.",
        type: "number",
        default: 0
      }, {
        name: "yoyo",
        title: "Yoyo",
        description: "This function only has effect if used along with repeat. When active, the behaviour of the tween will be like a yoyo, i.e. it will bounce to and from the start and end values, instead of just repeating the same sequence from the beginning. Defaults to false.",
        type: "boolean",
        default: !1
      }, {
        name: "startEvent",
        title: "Start Event",
        description: "Executed right before the tween starts animating, after any delay time specified by the delay method. This will be executed only once per tween, i.e. it will not be run when the tween is repeated via repeat(). It is great for synchronising to other events or triggering actions you want to happen when a tween starts.",
        type: "string"
      }, {
        name: "stopEvent",
        title: "Stop Event",
        description: "Executed when a tween is explicitly stopped via stop(), but not when it is completed normally.",
        type: "string"
      }, {
        name: "updateEvent",
        title: "Update Event",
        description: "Executed each time the tween is updated, after the values have been actually updated.",
        type: "string"
      }, {
        name: "completeEvent",
        title: "Complete Event",
        description: "Executed when a tween is finished normally (i.e. not stopped).",
        type: "string"
      }, {
        name: "repeatEvent",
        title: "Repeat Event",
        description: "Executed whenever a tween has just finished one repetition and will begin another.",
        type: "string"
      }],
      array: !0
    }), e.prototype.initialize = function () {
      var s = this.app,
        o;
      this.tweenInstances = [], this.tweenCallbacks = [];
      var h = function (p) {
        return function () {
          this.start(p)
        }
      };
      for (o = 0; o < this.tweens.length; o++) {
        var u = this.tweens[o];
        u.autoPlay && this.start(o), u.event && u.event.length > 0 && (this.tweenCallbacks[o] = {
          event: u.event,
          cb: h(o)
        }, s.on(this.tweenCallbacks[o].event, this.tweenCallbacks[o].cb, this))
      }
      this.on("enable", function () {
        for (o = 0; o < this.tweens.length; o++) this.tweenInstances[o] && !this.tweenInstances[o].playing && (this.tweenInstances[o].playing || this.tweenInstances[o].resume())
      }), this.on("disable", function () {
        for (o = 0; o < this.tweens.length; o++) this.tweenInstances[o] && this.tweenInstances[o].playing && this.tweenInstances[o].pause()
      }), this.on("destroy", function () {
        for (o = 0; o < this.tweenCallbacks.length; o++) this.tweenCallbacks[o] && (s.off(this.tweenCallbacks[o].event, this.tweenCallbacks[o].cb, this), this.tweenCallbacks[o] = null)
      }, this), this.on("attr", function (p, _, g) {
        for (o = 0; o < this.tweenCallbacks.length; o++) this.tweenCallbacks[o] && (s.off(this.tweenCallbacks[o].event, this.tweenCallbacks[o].cb, this), this.tweenCallbacks[o] = null);
        for (o = 0; o < this.tweens.length; o++) {
          var k = this.tweens[o];
          k.event.length > 0 && (this.tweenCallbacks[o] = {
            event: k.event,
            cb: h(o)
          }, s.on(this.tweenCallbacks[o].event, this.tweenCallbacks[o].cb, this))
        }
      })
    }, e.prototype.start = function (s) {
      var o = this.app,
        h = this.tweens[s],
        u = ["In", "Out", "InOut"],
        p = ["Linear", "Quadratic", "Cubic", "Quartic", "Quintic", "Sine", "Exponential", "Circular", "Elastic", "Back", "Bounce"],
        _;
      if (p[h.easingFunction] == "Linear" ? _ = a[p[h.easingFunction]] : _ = a[p[h.easingFunction] + u[h.easingType]], !_) {
        console.error("ERROR: tween - invalid easing function specified");
        return
      }
      var g = this.tweenInstances;
      g[s] && g[s].stop();
      for (var k = h.path.split("."), E = this.entity, D = 0; D < k.length - 1; D++) E = E[k[D]];
      var B = k[k.length - 1],
        O = E[B],
        H, Q, it = typeof O == "number",
        V = h.start,
        nt = h.end;
      if (it) H = {
        x: V.x
      }, Q = {
        x: nt.x
      };
      else if (O instanceof a.Vec2) H = new a.Vec2(V.x, V.y), Q = new a.Vec2(nt.x, nt.y);
      else if (O instanceof a.Vec3) H = new a.Vec3(V.x, V.y, V.z), Q = new a.Vec3(nt.x, nt.y, nt.z);
      else if (O instanceof a.Vec4) H = V.clone(), Q = nt.clone();
      else if (O instanceof a.Color) H = new a.Color(V.x, V.y, V.z, V.w), Q = new a.Color(nt.x, nt.y, nt.z, nt.w);
      else {
        console.error("ERROR: tween - specified property must be a number, vec2, vec3, vec4 or color");
        return
      }
      var ct = function (Ct) {
        switch (B) {
          case "eulerAngles":
            E.setEulerAngles(Ct);
            break;
          case "localEulerAngles":
            E.setLocalEulerAngles(Ct);
            break;
          case "localPosition":
            E.setLocalPosition(Ct);
            break;
          case "localScale":
            E.setLocalScale(Ct);
            break;
          case "position":
            E.setPosition(Ct);
            break;
          default:
            E[B] = it ? Ct.x : Ct, E instanceof a.Material && E.update();
            break
        }
      };
      ct(H), g[s] = this.app.tween(H), g[s].on("start", () => {
        h.startEvent !== "" && o.fire(h.startEvent)
      }), g[s].on("stop", () => {
        h.stopEvent !== "" && o.fire(h.stopEvent), g[s] = null
      }), g[s].on("update", () => {
        ct(H), h.updateEvent !== "" && o.fire(h.updateEvent)
      }), g[s].on("complete", () => {
        h.completeEvent !== "" && o.fire(h.completeEvent), g[s] = null
      }), g[s].on("loop", () => {
        h.repeatEvent !== "" && o.fire(h.repeatEvent)
      }), g[s].to(Q, h.duration, _).repeat(h.repeat === -1 ? 1 / 0 : h.repeat, h.repeatDelay).yoyo(h.yoyo).delay(h.delay).start()
    }
  }

  function Pa(a) {
    var e = a.createScript("sdsFlyCamera");
    e.attributes.add("speed", {
      type: "number",
      default: 10
    }), e.attributes.add("fastSpeed", {
      type: "number",
      default: 20
    }), e.attributes.add("mode", {
      type: "number",
      default: 0,
      enum: [{
        Lock: 0
      }, {
        Drag: 1
      }]
    }), e.prototype.initialize = function () {
      var s = this.entity.getLocalEulerAngles();
      this.ex = s.x, this.ey = s.y, this.moved = !1, this.lmbDown = !1, this.app.mouse.disableContextMenu(), this.app.mouse.on(a.EVENT_MOUSEMOVE, this.onMouseMove, this), this.app.mouse.on(a.EVENT_MOUSEDOWN, this.onMouseDown, this), this.app.mouse.on(a.EVENT_MOUSEUP, this.onMouseUp, this)
    }, e.prototype.update = function (s) {
      this.entity.setLocalEulerAngles(this.ex, this.ey, 0);
      var o = this.app,
        h = this.speed;
      o.keyboard.isPressed(a.KEY_SHIFT) && (h = this.fastSpeed), o.keyboard.isPressed(a.KEY_UP) || o.keyboard.isPressed(a.KEY_W) ? this.entity.translateLocal(0, 0, -h * s) : (o.keyboard.isPressed(a.KEY_DOWN) || o.keyboard.isPressed(a.KEY_S)) && this.entity.translateLocal(0, 0, h * s), o.keyboard.isPressed(a.KEY_LEFT) || o.keyboard.isPressed(a.KEY_A) ? this.entity.translateLocal(-h * s, 0, 0) : (o.keyboard.isPressed(a.KEY_RIGHT) || o.keyboard.isPressed(a.KEY_D)) && this.entity.translateLocal(h * s, 0, 0), o.keyboard.isPressed(a.KEY_E) ? this.entity.translateLocal(0, h * s, 0) : o.keyboard.isPressed(a.KEY_Q) && this.entity.translateLocal(0, -h * s, 0)
    }, e.prototype.onMouseMove = function (s) {
      if (this.mode) {
        if (!this.lmbDown) return
      } else if (!a.Mouse.isPointerLocked()) return;
      if (!this.moved) {
        this.moved = !0;
        return
      }
      this.ex -= s.dy / 5, this.ex = a.math.clamp(this.ex, -90, 90), this.ey -= s.dx / 5
    }, e.prototype.onMouseDown = function (s) {
      s.button === 0 && (this.lmbDown = !0, !this.mode && !a.Mouse.isPointerLocked() && this.app.mouse.enablePointerLock())
    }, e.prototype.onMouseUp = function (s) {
      s.button === 0 && (this.lmbDown = !1)
    }
  }

  function Fa(a) {
    function e(p, _) {
      var g = {
        attributes: {
          aPosition: p.SEMANTIC_POSITION,
          aUv0: p.SEMANTIC_TEXCOORD0
        },
        vshader: ["attribute vec3 aPosition;", "attribute vec2 aUv0;", "", "uniform mat4 matrix_model;", "uniform mat4 matrix_viewProjection;", "", "varying vec2 vUv0;", "", "void main(void)", "{", "  vUv0 = aUv0;", "  gl_Position = matrix_viewProjection * matrix_model * vec4(aPosition, 1.0);", "}"].join(""),
        fshader: ["precision " + _.precision + " float;", "varying vec2 vUv0;", "", "uniform sampler2D uCombinedFrame;", "uniform float flip_y;", "", "void main(void)", "{", "vec2 uv = vUv0;", "if(flip_y >= 1.0) {", "   uv = vec2(vUv0.x, 1.0 - vUv0.y);", "}", "  float alpha = texture2D(uCombinedFrame, vec2(0.5 + uv.x / 2.0, uv.y)).r;", "  vec3 color = texture2D(uCombinedFrame, vec2(uv.x / 2.0, uv.y)).rgb;", "  gl_FragColor = vec4(color, alpha);", "}"].join("")
      };
      return new p.Shader(_, g)
    }

    function s(p, _) {
      var g = {
        attributes: {
          aPosition: p.SEMANTIC_POSITION,
          aUv0: p.SEMANTIC_TEXCOORD0
        },
        vshader: ["attribute vec3 aPosition;", "attribute vec2 aUv0;", "", "uniform mat4 matrix_model;", "uniform mat4 matrix_viewProjection;", "", "varying vec2 vUv0;", "", "void main(void)", "{", "  vUv0 = aUv0;", "  gl_Position = matrix_viewProjection * matrix_model * vec4(aPosition, 1.0);", "}"].join(""),
        fshader: ["precision " + _.precision + " float;", "varying vec2 vUv0;", "", "uniform sampler2D uCombinedFrame;", "uniform float flip_y;", "", "void main(void)", "{", "vec2 uv = vUv0;", "if(flip_y >= 1.0) {", "   uv = vec2(vUv0.x, 1.0 - vUv0.y);", "}", "  vec4 color = texture2D(uCombinedFrame, uv);", "  gl_FragColor = color;", "}"].join("")
      };
      return new p.Shader(_, g)
    }
    var o = function (p, _) {
      this.videoElement = document.createElement("video"), this.videoElement.addEventListener("canplay", function (g) {
        p.setSource(this.videoElement)
      }.bind(this)), this.videoElement.src = _, this.videoElement.crossOrigin = "anonymous", this.videoElement.loop = !0, this.videoElement.muted = !0
    };
    o.prototype.constructor = o, o.prototype.play = function () {
      !this.videoElement || (this.videoElement.play(), this.videoElement.muted = !1)
    }, o.prototype.stop = function () {
      !this.videoElement || this.videoElement.pause()
    }, o.prototype.pause = function () {
      !this.videoElement || this.videoElement.pause()
    }, o.prototype.destroy = function () {
      !this.videoElement || (this.videoElement.pause(), this.videoElement.src = "", this.videoElement = null)
    };
    var h = a.createScript("sdsVideoPlayer");
    h.attributes.add("entitys", {
      type: "entity",
      array: !0,
      title: "Entitys",
      description: "\u7528\u4E8E\u627F\u8F7D\u89C6\u9891\u64AD\u653E\u76843D\u7269\u4F53\u3002"
    }), h.attributes.add("videoAssetURL", {
      type: "string",
      title: "Video Asset URL",
      description: "\u89C6\u9891\u8D44\u6E90\u5916\u90E8\u94FE\u63A5\u5730\u5740\u3002"
    }), h.attributes.add("isTransparentVideo", {
      type: "boolean",
      default: !0,
      title: "is transparent video",
      description: "\u662F\u5426\u4E3A\u900F\u660E\u89C6\u9891\uFF0C\u9ED8\u8BA4\u4E3A\u900F\u660E\u89C6\u9891\uFF0C\u8BE5\u9879\u4F1A\u5F71\u54CD\u6240\u6709\u89C6\u9891\u8D44\u6E90"
    }), h.attributes.add("id", {
      type: "string",
      default: "video1",
      title: "video id",
      description: "\u8BBE\u7F6Evideo id, \u7528\u4E8E\u533A\u5206\u591A\u89C6\u9891"
    }), h.prototype.initialize = function () {
      var p = this.app;
      this.videoTexture = new a.Texture(p.graphicsDevice, {
        format: a.PIXELFORMAT_R8_G8_B8_A8,
        mipmaps: !1
      }), this.videoTexture.minFilter = a.FILTER_LINEAR, this.videoTexture.magFilter = a.FILTER_LINEAR, this.videoTexture.addressU = a.ADDRESS_CLAMP_TO_EDGE, this.videoTexture.addressV = a.ADDRESS_CLAMP_TO_EDGE, this.material = new a.Material, this.isTransparentVideo ? this.material.shader = e(a, this.app.graphicsDevice) : this.material.shader = s(a, this.app.graphicsDevice), this.material.cull = a.CULLFACE_NONE, this.material.blendType = a.BLEND_NORMAL, this.material.setParameter("flip_y", 0), this.material.setParameter("uCombinedFrame", this.videoTexture), this.material.update();
      for (var _ = 0; _ < this.entitys.length; _++) this.entitys[_].model.meshInstances[0].material = this.material, this.entitys[_].enabled = !1;
      this.upload = !0, this.linkVideo(), this._videoFrame = null, this.on("enable", this.playVideo, this), this.on("disable", this.pauseVideo, this), this.on("destroy", this.destroyVideo, this)
    }, h.prototype.linkVideo = function () {
      if (!a.platform.browser) this.app.fire("videoplayer", this.videoAssetURL, this.id), this.app.on("setVideoTexture", this.setTexture, this);
      else {
        var p = this._video = new o(this.videoTexture, this.videoAssetURL),
          _ = this.material;
        this.app.on("start-demo", function (g) {
          if (g == this.id) {
            for (var k = 0; k < this.entitys.length; k++) this.entitys[k].enabled = !0;
            _.setParameter("u_textureSize", [p.videoElement.videoWidth, p.videoElement.videoHeight]), p.play()
          }
        }.bind(this))
      }
    }, h.prototype.playVideo = function () {
      a.platform.browser ? this._video.play() : this.app.fire("playvideo", this.id)
    }, h.prototype.stopVideo = function () {
      a.platform.browser ? this._video.stop() : this.app.fire("stopvideo", this.id)
    }, h.prototype.pauseVideo = function () {
      a.platform.browser ? this._video.pause() : this.app.fire("pasuevideo", this.id)
    }, h.prototype.destroyVideo = function () {
      a.platform.browser ? (this._video.destroy(), this._video = null) : this.app.fire("destroyvideo", this.id), this.off("enable", this.playVideo, this), this.off("disable", this.pauseVideo, this), this.off("destroy", this.destroyVideo, this)
    }, h.prototype.setTexture = function (p, _) {
      if (console.log("sdsVideoPlayer setTexture", p, _), _ == this.id) {
        this.material.setParameter("uCombinedFrame", p), this.material.update();
        for (var g = 0; g < this.entitys.length; g++) this.entitys[g].enabled = !0, console.log("set entity enable", this.entitys[g])
      }
    }, h.prototype.update = function (p) {
      this.upload = !this.upload, this.upload && a.platform.browser && this.videoTexture.upload()
    };
    var u = a.createScript("sdsPlayButton_test");
    u.prototype.initialize = function () {
      this.entity.element.on("click", function (p) {
        this.app.fire("start-demo"), this.entity.destroy()
      }, this), a.platform.browser || this.entity.destroy()
    }
  }

  function Da(a) {
    class e extends a.ScriptType {
      constructor() {
        super(...arguments), this._slotMap = new Map, this._playingCache = []
      }
      initialize() {
        this.entity.audioPlayer = this, this.slots.forEach(h => {
          this.addSlot(h)
        }), this.on("destroy", () => {
          this._slotMap.forEach(h => {
            h.destroy()
          }), this.entity.off()
        }), this.on("disable", () => {
          this._slotMap.forEach(h => {
            h.playing && (h.pause(), this._playingCache.push(h.name))
          })
        }), this.on("enable", () => {
          this._playingCache.forEach(h => {
            this.getSlot(h).play()
          }), this._playingCache = []
        })
      }
      getSlot(h) {
        return this._slotMap.get(h)
      }
      addSlot(h) {
        this._slotMap.set(h.name, new s(h))
      }
      play(h) {
        let u = this.getSlot(h);
        u && u.play()
      }
      pause(h) {
        let u = this.getSlot(h);
        u && u.pause()
      }
      stop(h) {
        let u = this.getSlot(h);
        u && u.stop()
      }
      seek(h, u) {
        let p = this.getSlot(h);
        p && p.seek(u)
      }
      setVolume(h, u) {
        let p = this.getSlot(h);
        p && (p.volume = u)
      }
    }
    class s {
      constructor(h) {
        a.platform.browser ? (this.context = new Audio(h.url), this.context.preload = "metadata") : typeof wx < "u" ? (this.context = wx.createInnerAudioContext(), this.context.src = h.url) : typeof my < "u" && (this.context = my.createInnerAudioContext(), this.context.src = h.url), this.context.autoplay = h.autoplay, h.autoplay && (this._playing = !0), this.context.loop = h.loop, this.context.volume = h.volume, this.name = h.name
      }
      get volume() {
        return this.context.volume
      }
      set volume(h) {
        this.context.volume = h
      }
      get duration() {
        return this.context.duration
      }
      get currentTime() {
        return this.context.currentTime
      }
      seek(h) {
        a.platform.browser ? this.context.currentTime = h : this.context.seek(h)
      }
      get isLoop() {
        return this.context.loop
      }
      set isLoop(h) {
        this.context.loop != h && (this.context.loop = h)
      }
      get playing() {
        return this._playing
      }
      setUrl(h) {
        this._playing && (this._onPlayend && (a.platform.browser ? this.context.onended = null : this.context.offEnded(this._onPlayend), this._onPlayend = null), this.stop()), a.platform.browser ? this.context.src = h : this.context.src = h
      }
      play() {
        this._playing || (this.context.play(), this._playing = !0, this.isLoop || (a.platform.browser ? this.context.onended = this._onPlayend = () => {
          this.stop()
        } : this.context.onEnded(this._onPlayend = () => {
          this.stop()
        })))
      }
      pause() {
        this._playing && (this.context.pause(), this._playing = !1)
      }
      stop() {
        a.platform.browser ? (this.context.currentTime = 0, this.context.pause(), this._playing = !1) : (this.context.stop(), this._playing = !1)
      }
      destroy() {
        this.stop(), a.platform.browser ? this.context : this.context.destroy(), this.context = null
      }
    }
    a.registerScript(e, "sdsAudioPlayer"), e.attributes.add("slots", {
      type: "json",
      schema: [{
        name: "name",
        type: "string"
      }, {
        name: "url",
        type: "string"
      }, {
        name: "autoplay",
        type: "boolean",
        default: !1
      }, {
        name: "loop",
        type: "boolean",
        default: !1
      }, {
        name: "volume",
        type: "number",
        default: 1,
        min: 0,
        max: 1
      }],
      array: !0
    })
  }
  class za {
    constructor() {
      this.interruptFlag = !1, this.taskQueue = [], this.secentTackQueue = [], this.isExecuting = !1, this.excutingPromise = null
    }
    addTask(e) {
      this.isExecuting ? this.secentTackQueue.push(e) : this.taskQueue.push(e)
    }
    interruptTasks() {
      this.interruptFlag = !0
    }
    get isCurrentlyExecuting() {
      return this.isExecuting
    }
    executeTask(e) {
      if (this.interruptFlag) return console.log("\u4EFB\u52A1\u88AB\u4E2D\u65AD"), this.isExecuting = !1, Promise.reject("Interrupted");
      const s = e();
      return Array.isArray(s) ? this.executeTasksSequentially(s) : Promise.resolve(s)
    }
    executeTasksSequentially(e = this.taskQueue) {
      this.isExecuting = !0, this.interruptFlag = !1;
      let s = Promise.resolve();
      return e.forEach(o => {
        s = s.then(() => this.executeTask(o))
      }), this.excutingPromise = s.then(() => {
        if (this.secentTackQueue.length > 0) return this.taskQueue = this.secentTackQueue, this.secentTackQueue = [], this.executeTasksSequentially();
        this.isExecuting = !1, this.taskQueue = [], this.excutingPromise = null
      }), this.excutingPromise
    }
    executeTasksInParallel() {
      return this.isExecuting = !0, this.excutingPromise = Promise.all(this.taskQueue.map(e => this.executeTask(e))).then(() => {
        this.isExecuting = !1, this.taskQueue = []
      }), this.excutingPromise
    }
  }

  function La(a, e) {
    class s extends a.ScriptType {
      constructor() {
        super(...arguments), this.walkSpeed = 2, this.runSpeed = 4, this.defaultMouthSpeed = 1, this._moveTarget = null, this._isMoving = !1, this._controller = null, this._morphInstance = null, this._assistantSlot = null, this.playSayHandler = new za, this.__switch = 1
      }
      get _isSelfControll() {
        return this._controller === this
      }
      initialize() {
        this.anim = this.entity.anim, this.anim || W.error("sdsAssistant: entity has no AnimComponent"), this.audioPlayer = this.entity.audioPlayer, this.audioPlayer || W.error("sdsAssistant: entity has no audioPlayer"), this.audioPlayer.addSlot({
          name: "assistant",
          url: "",
          autoplay: !1,
          loop: !1,
          volume: 1
        }), this._morphInstance = this.entity.model._model.morphInstances[0], this._morphInstance ? this.refineMorphMap(this._morphInstance) : W.warn("sdsAssistant: entity has no morphInstances"), this.tinyRoot = ke.call(this), this.parentEntity = this.tinyRoot.rootEntity, this.cameraEntity = this.tinyRoot.camera;
        const h = () => {
          let u = this.cameraEntity.getPosition();
          if (u.x === 0 && u.y === 0 && u.z === 0) this.entity.model.enabled = !1, W.info("vio \u672A\u521D\u59CB\u5316\u5B8C\u6210\uFF0C\u7B49\u5F85\u4E0B\u4E00\u5E27\u663E\u793A\u6570\u5B57\u4EBA"), this.app.once("update", h, this);
          else {
            this.entity.model.enabled = !0;
            let p = this._getCameraFrontPorition(2);
            this.parentEntity.setPosition(p), this.parentEntity.lookAt(new a.Vec3(u.x, p.y, u.z), a.Vec3.UP)
          }
        };
        h(), this.on("destroy", () => {
          this.entity.off()
        })
      }
      update(h) {
        const u = this.cameraEntity.getPosition();
        if (u.x === 0 && u.y === 0 && u.z === 0 && this.entity.model.enabled === !0 ? this.entity.model.enabled = !1 : (u.x !== 0 || u.y !== 0 || u.z !== 0) && this.entity.model.enabled === !1 && (this.entity.model.enabled = !0), this._isMoving) {
          let p = this._moveTarget.clone().sub(this.parentEntity.getPosition()).normalize(),
            _ = this._moveTarget.clone().sub(this.parentEntity.getPosition()).length();
          _ > 2 ? (this.parentEntity.translate(p.mulScalar(h * this.runSpeed)), this.parentEntity.lookAt(this._moveTarget, a.Vec3.UP), this.anim.baseLayer.activeState != "run" && this.playAnim("run")) : _ > .1 ? (this.parentEntity.translate(p.mulScalar(h * this.walkSpeed)), this.parentEntity.lookAt(this._moveTarget, a.Vec3.UP), this.anim.baseLayer.activeState != "walk" && this.playAnim("walk")) : (this._isMoving = !1, this._controller && this._controller.fire("assistant_move_end"))
        }
        this._isSelfControll
      }
      blendShapeOfFacegoodToARKit(h) {
        const u = new Array(52);
        for (let p = 0; p < 52; p++) u[p] = Ba[p].reduce((_, g) => Math.max(_, g >= 0 ? h[g] : 0), 0);
        return u
      }
      setARKitBS(h, u, p = 1) {
        !h || u.forEach((_, g) => {
          typeof h._weightMap.get(g.toString()) == "number" && h.setWeight(h._weightMap.get(g.toString()), _ * p)
        })
      }
      updateMouthBS(h, u) {
        if (!!h && typeof h._weightMap.get("17") == "number") {
          let p = h._weightMap.get("17"),
            _ = h.getWeight(p);
          this.__switch === 1 ? u > 1 - _ && (this.__switch = -1, u = u - (1 - _)) : this.__switch === -1 && u > _ && (this.__switch = 1, u = -u + 2 * _), h.setWeight(p, _ + u * this.__switch)
        }
      }
      setARKitBSTest(h, u, p = 1) {
        !h || h.setWeight(0, u[17] * p)
      }
      playAnim(h) {
        this.anim.baseLayer.activeState != h && (W.log("anim set trigger", h), this.anim.setTrigger(h))
      }
      playAudio(h) {
        this._assistantSlot = this.audioPlayer.getSlot("assistant"), this._assistantSlot.setUrl(h), this.audioPlayer.play("assistant")
      }
      parseZhiYunData(h) {
        var u = h.trim().split(`
`);
        let p = {};
        for (var _ = 0; _ < u.length; _++) {
          var g = u[_].trim().split(" "),
            k = g[0],
            E = g.slice(1).map(parseFloat);
          p[k.toLowerCase()] = E
        }
        let D = [];
        for (let B = 0; B < p.arkit_jawopen.length; B++) {
          const O = new Array(52);
          for (let H = 0; H < 52; H++) p["arkit_" + Li[H]] && (O[H] = p["arkit_" + Li[H]][B]);
          D.push(O)
        }
        return D
      }
      refineMorphMap(h) {
        let u = h._weightMap;
        u.forEach((_, g) => {
          Li.forEach((k, E) => {
            g.toLowerCase().indexOf(k) >= 0 && u.set(E.toString(), _)
          })
        });
        for (var p in u.keys());
      }
      async say(h, u) {
        for (let p = 0; p < h.length; p++) {
          const _ = await new Promise((g, k) => {
            if (h[p].audioUrl && h[p].blendShape) {
              let E = {
                videoUrl: h[p].audioUrl,
                blendShape: h[p].blendShape
              };
              g(E)
            } else if (h[p].tts && h[p].bs) setTimeout(() => {
              let E = this.parseZhiYunData(h[p].bs),
                D = {
                  videoUrl: h[p].tts,
                  blendShape: E
                };
              g(D)
            }, 1e3);
            else if (h[p].audioUrl) {
              let E = {
                videoUrl: h[p].audioUrl
              };
              g(E)
            }
          });
          W.info("addSayTask", _.videoUrl), this.playSayHandler.addTask(() => new Promise((g, k) => {
            W.info("\u6267\u884C\u4EFB\u52A1\uFF1A", _), this.playAudio(_.videoUrl);
            let E = D => {
              const B = this._assistantSlot.currentTime,
                O = B / this._assistantSlot.duration;
              if (B == 0 && this._assistantSlot.context.play(), O > .99 && this._assistantSlot.stop(), this._assistantSlot && !this._assistantSlot.playing && (this._assistantSlot = null, this.app.off("update", E, this), this.setARKitBS(this._morphInstance, new Array(52).fill(0), 3), g(null)), _.blendShape) {
                const H = parseInt("" + O * _.blendShape.length),
                  Q = _.blendShape[H];
                if (Q.length === 116) {
                  let it = this.blendShapeOfFacegoodToARKit(Q);
                  this.setARKitBS(this._morphInstance, it, 3)
                } else Q.length === 52 && this.setARKitBS(this._morphInstance, Q, 3)
              } else this.updateMouthBS(this._morphInstance, D * this.defaultMouthSpeed)
            };
            this.app.on("update", E, this)
          }))
        }
        return this.playSayHandler.isCurrentlyExecuting || this.playSayHandler.executeTasksSequentially(), this.playSayHandler.excutingPromise.then(() => {
          u && u()
        }), this.playSayHandler.excutingPromise
      }
      moveToPosition(h) {
        this._moveTarget = h, this._isMoving = !0
      }
      setPositionAndLookAt(h, u) {
        this.parentEntity.setPosition(h), this.parentEntity.lookAt(u, a.Vec3.UP)
      }
      setController(h) {
        this._controller && (this._controller.off("assistant_move"), this._controller.off("assistant_playAnim"), this._controller.off("assistant_say"), this._controller.off("assistant_playAudio"), this._controller.off("assistant_moveToPosition")), this._controller = h, this._controller && (this._controller.on("assistant_moveToPosition", u => {
          this.moveToPosition(u)
        }), this._controller.on("assistant_move", (u, p) => {
          this.setPositionAndLookAt(u, p)
        }), this._controller.on("assistant_playAnim", u => {
          this.playAnim(u)
        }), this._controller.on("assistant_say", (u, p) => {
          this.say(u, p)
        }), this._controller.on("assistant_playAudio", u => {
          this.playAudio(u)
        }))
      }
      _getCameraFrontPorition(h) {
        let u = this.cameraEntity.forward.clone();
        return u.y = 0, u.normalize(), this.cameraEntity.getPosition().clone().sub(new a.Vec3(0, 1.5, 0)).add(u.mulScalar(h))
      }
    }
    a.registerScript(s, "sdsAssistant", e), s.attributes.add("walkSpeed", {
      type: "number",
      default: 2
    }), s.attributes.add("runSpeed", {
      type: "number",
      default: 4
    }), s.attributes.add("defaultMouthSpeed", {
      type: "number",
      default: 1
    })
  }
  const Li = ["eyeBlinkLeft", "eyeLookDownLeft", "eyeLookInLeft", "eyeLookOutLeft", "eyeLookUpLeft", "eyeSquintLeft", "eyeWideLeft", "eyeBlinkRight", "eyeLookDownRight", "eyeLookInRight", "eyeLookOutRight", "eyeLookUpRight", "eyeSquintRight", "eyeWideRight", "jawForward", "jawLeft", "jawRight", "jawOpen", "mouthClose", "mouthFunnel", "mouthPucker", "mouthLeft", "mouthRight", "mouthSmileLeft", "mouthSmileRight", "mouthFrownLeft", "mouthFrownRight", "mouthDimpleLeft", "mouthDimpleRight", "mouthStretchLeft", "mouthStretchRight", "mouthRollLower", "mouthRollUpper", "mouthShrugLower", "mouthShrugUpper", "mouthPressLeft", "mouthPressRight", "mouthLowerDownLeft", "mouthLowerDownRight", "mouthUpperUpLeft", "mouthUpperUpRight", "browDownleft", "browDownRight", "browInnerUp", "browOuterUpLeft", "browOuterUpRight", "cheekPuff", "cheekSquintLeft", "cheekSquintRight", "noseSneerLeft", "noseSneerRight", "tongueOut"].map(a => a.toLowerCase());
  ["brow_lower_l", "tongue_Scale__X", "tongue_Scale_Y", "tongue_Scale__Y", "tongue_Scale_Z", "tongue_Scale__Z", "nose_out_l", "nose_out_r", "tongue_u", "tongue_u_u", "brow_raise_d", "cheek_suck_r", "mouth_stretch_u", "tongue_u_d", "tooth_d_d", "tongue_d", "tooth_r", "tooth_d_u", "cheek_UP", "eye_blink1_l", "eye_blink1_r", "eye_blink2_l", "eye_blink2_r", "eye_lidTight_l", "eye_lidTight_r", "eye_shutTight_l", "eye_shutTight_r", "brow_lower_r", "eye_upperLidRaise_l", "eye_upperLidRaise_r", "eye_downLidRaise_l", "eye_downLidRaise_r", "jaw_sideways_l", "jaw_sideways_r", "jaw_thrust_c", "mouth_chew_c", "mouth_chinRaise_d", "mouth_chinRaise_u", "brow_raise_c", "mouth_dimple_l", "mouth_dimple_r", "mouth_funnel_dl", "mouth_funnel_dr", "mouth_funnel_ul", "mouth_funnel_ur", "mouth_lipCornerDepressFix_l", "mouth_lipCornerDepressFix_r", "mouth_lipCornerDepress_l", "mouth_lipCornerDepress_r", "brow_raise_l", "mouth_lipCornerPullOpen_l", "mouth_lipCornerPullOpen_r", "mouth_lipCornerPull_l", "mouth_lipCornerPull_r", "mouth_lipStretchOpen_l", "mouth_lipStretchOpen_r", "mouth_lipStretch_l", "mouth_lipStretch_r", "mouth_lowerLipDepress_l", "mouth_lowerLipDepress_r", "brow_raise_r", "mouth_lowerLipProtrude_c", "mouth_oh_c", "mouth_oo_c", "mouth_pressFix_c", "mouth_press_l", "mouth_press_r", "mouth_pucker_l", "mouth_pucker_r", "mouth_screamFix_c", "mouth_sideways_l", "cheek_puff_l", "mouth_sideways_r", "mouth_stretch_c", "mouth_suck_dl", "mouth_suck_dr", "mouth_suck_ul", "mouth_suck_ur", "mouth_upperLipRaise_l", "mouth_upperLipRaise_r", "nose_wrinkle_l", "nose_wrinkle_r", "cheek_puff_r", "tooth_l", "eye_lookDown1_l", "eye_lookDown2_l", "eye_lookLeft_l", "eye_lookRight_l", "eye_lookUp_l", "eye_lookDown1_r", "eye_lookDown2_r", "eye_lookLeft_r", "eye_lookRight_r", "cheek_raise_l", "eye_lookUp_r", "tongue_Rot_1X", "tongue_Rot__1X", "tongue_Rot_2X", "tongue_Rot__2X", "tongue_Rot_3X", "tongue_Rot__3X", "tongue_Rot_1Y", "tongue_Rot__1Y", "tongue_Rot_2Y", "cheek_raise_r", "tongue_Rot__2Y", "tongue_Rot_3Y", "tongue_Rot__3Y", "tongue_Rot_1Z", "tongue_Rot__1Z", "tongue_Rot_2Z", "tongue_Rot__2Z", "tongue_Rot_3Z", "tongue_Rot__3Z", "tongue_Scale_X", "cheek_suck_l"].map(a => a.toLowerCase());
  const Ba = [
    [21],
    [85],
    [87],
    [86],
    [88],
    [25],
    [30, 28],
    [22],
    [90],
    [92],
    [91],
    [94],
    [26],
    [31, 29],
    [34],
    [32],
    [33],
    [73],
    [35],
    [41, 42, 43, 44],
    [67, 68],
    [70],
    [72],
    [52],
    [53],
    [47, 45],
    [48, 46],
    [39],
    [40],
    [56],
    [57],
    [74, 75],
    [76, 77],
    [36],
    [37],
    [65],
    [66],
    [58],
    [59],
    [78],
    [79],
    [0],
    [27],
    [38],
    [49],
    [60],
    [71, 82],
    [18],
    [18],
    [6],
    [7],
    [-1]
  ];

  function Oa(a, e) {
    const s = new a.StandardMaterial;
    s.diffuse = new a.Color(0, 0, 0, 0), s.opacity = 0, s.blendType = 2, s.update();
    let o = null;
    e && (o = e.scene.layers.getLayerByName("Mask"), o || (o = new a.Layer({
      name: "Mask",
      opaqueSortMode: a.SORTMODE_MATERIALMESH,
      transparentSortMode: a.SORTMODE_BACK2FRONT,
      enabled: !0
    }), e.scene.layers.insertTransparent(o, 0)));
    class h extends a.ScriptType {
      initialize() {
        if (this.entity.model && (this.entity.model.layers = [o.id], this.entity.model.meshInstances.forEach(p => {
            p.material = s
          })), this.entity.render && (this.entity.render.layers = [o.id], this.entity.render.material = s), !Pt.Instance.camera.camera.layers.includes(o.id)) {
          let p = Pt.Instance.camera.camera.layers.slice();
          p.push(o.id), Pt.Instance.camera.camera.layers = p
        }
      }
    }
    a.registerScript(h, "sdsMask")
  }
  class Ua {
    constructor(e, s, o, h) {
      this.entity = e, this.item = s, this.onclick = o, this.onmove = h, e.model && e.model.meshInstances ? this.meshInstances = e.model.meshInstances : e.render && e.render.meshInstances ? this.meshInstances = e.render.meshInstances : this.meshInstances = []
    }
  }
  class Na {
    constructor(e, s, o, h) {
      if (this.pc = e, this.app = s, this.camera = o, this.onClick = h, this.pickRadius = 10, this.triggerRadius = 20, this.triggerTime = 500, this.entries = [], this.layer = this.app.scene.layers.getLayerByName("pickerLayer"), this.layer || (this.layer = new this.pc.Layer({
          name: "pickerLayer"
        }), this.app.scene.layers.push(this.layer)), !o.camera.layers.includes(this.layer.id)) {
        let u = this.camera.camera.layers.slice();
        u.push(this.layer.id), this.camera.camera.layers = u
      }
      this.picker = new this.pc.Picker(this.app, Math.round(s.graphicsDevice.width / 16) * 4, Math.round(s.graphicsDevice.height / 16) * 4), this.app.touch ? (s.touch.on(e.EVENT_TOUCHSTART, this.touchStart, this), s.touch.on(e.EVENT_TOUCHEND, this.touchEnd, this)) : this.app.mouse && (s.mouse.on(e.EVENT_MOUSEDOWN, this.mouseDown, this), s.mouse.on(e.EVENT_MOUSEUP, this.mouseUp, this))
    }
    dispose() {
      this.app.touch ? (this.app.touch.off(this.pc.EVENT_TOUCHSTART, this.touchStart, this), this.app.touch.off(this.pc.EVENT_TOUCHEND, this.touchEnd, this)) : (this.app.mouse.off(this.pc.EVENT_MOUSEDOWN, this.mouseDown, this), this.app.mouse.off(this.pc.EVENT_MOUSEUP, this.mouseUp, this)), this.clear()
    }
    setCamera(e) {
      this.camera = e
    }
    mouseDown(e) {
      this.camera && this.camera.camera && this.camera.camera.enabled && (this.startX = e.x, this.startY = e.y, this.startTime = Date.now())
    }
    mouseUp(e) {
      if (this.camera && this.camera.camera && this.camera.camera.enabled) {
        let s = e.x - this.startX,
          o = e.y - this.startY;
        Math.sqrt(s * s + o * o) < this.triggerRadius && Date.now() - this.startTime < this.triggerTime && this.onClick(this, e.x, e.y)
      }
    }
    touchStart(e) {
      this.camera && this.camera.camera && this.camera.camera.enabled && (this.startX = e.changedTouches[0].x, this.startY = e.changedTouches[0].y, this.startTime = Date.now())
    }
    touchEnd(e) {
      if (this.camera && this.camera.camera && this.camera.camera.enabled) {
        let s = e.changedTouches[0].x - this.startX,
          o = e.changedTouches[0].y - this.startY;
        Math.sqrt(s * s + o * o) < this.triggerRadius && Date.now() - this.startTime < this.triggerTime && this.onClick(this, e.changedTouches[0].x, e.changedTouches[0].y)
      }
    }
    intersectObjects(e, s) {
      var o, h;
      let u = this.app.scene,
        p = this.app.graphicsDevice.canvas,
        _ = parseInt("" + p.clientWidth, 10),
        g = parseInt("" + p.clientHeight, 10);
      this.picker.prepare(this.camera.camera, u, [this.layer]);
      let k = (h = (o = this.layer.instances) == null ? void 0 : o.transparentMeshInstances) == null ? void 0 : h.length;
      for (let E = 0; E < k; E++) {
        let D = this.layer.instances.transparentMeshInstances[E].material;
        D.parameters.texture_opacityMap && (D.parameters.texture_opacityMap.passFlags |= 1 << 18)
      }
      return this.picker.getSelection(Math.floor(e * (this.picker.width / _)) - this.pickRadius / 2, Math.floor(s * (this.picker.height / g)) - this.pickRadius / 2, this.pickRadius, this.pickRadius)
    }
    pick(e, s, o = !0) {
      let h = this.intersectObjects(e, s),
        u = [],
        p = this.camera.getPosition();
      for (let _ of h)
        if (_ && _.node) {
          let g = _.node;
          for (; !(g instanceof this.pc.Entity) && g !== null;) g = g.parent;
          if (g && g instanceof this.pc.Entity) {
            let k = g.getPosition().clone().sub(p).length();
            u.push({
              entity: g,
              distance: k,
              meshInstance: _
            })
          }
        } u.sort((_, g) => _.distance - g.distance);
      for (let _ of u) {
        let g = _.entity;
        if (g.enabled) {
          let k = this.find(g);
          if (k && (!o || k.onclick)) return {
            entity: k.entity,
            meshInstance: _.meshInstance,
            item: k.item,
            onclick: k.onclick,
            distance: _.distance
          }
        }
      }
      return null
    }
    add(e, s, o) {
      let h = new Ua(e, s, o);
      this.entries.push(h), h.meshInstances && this.layer.addMeshInstances(h.meshInstances)
    }
    find(e) {
      let s = this.entries.length;
      for (let o = s - 1; o >= 0; o--) {
        let h = this.entries[o];
        if (h.entity === e) return h
      }
      return null
    }
    delete(e) {
      let s = this.entries.length;
      for (let o = s - 1; o >= 0; o--) {
        let h = this.entries[o];
        h.item === e && (this.layer.removeMeshInstances(h.meshInstances), this.entries.splice(o, 1))
      }
    }
    clear() {
      this.layer.clearMeshInstances(), this.entries = []
    }
  }

  function qa(a, e) {
    var s = a.createScript("sdsEntityPicker");
    s.prototype.initialize = function () {
      this.entityPicker = new Na(a, e, Pt.Instance.camera, (h, u, p) => {
        let _ = h.pick(u, p);
        _ && _.onclick(_)
      }), this.app.on("add_entity_to_picker", this.onAddEntity, this), this.app.on("remove_entity_from_picker", this.onRemoveEntity, this), this.on("destroy", () => {
        this.app.off("add_entity_to_picker", this.onAddEntity, this), this.app.off("remove_entity_from_picker", this.onRemoveEntity, this), this.entityPicker.dispose()
      }, this)
    }, s.prototype.onAddEntity = function (h, u, p) {
      this.entityPicker.add(h, u, p)
    }, s.prototype.onRemoveEntity = function (h) {
      this.entityPicker.delete(h)
    };
    var o = a.createScript("sdsClickable");
    o.prototype.initialize = function () {
      this.tinyRoot = ke.call(this), this.added || (this.app.fire("add_entity_to_picker", this.entity, this.entity.name, this.onClick.bind(this)), this.added = !0), this.on("enable", () => {
        this.added || (this.app.fire("add_entity_to_picker", this.entity, this.entity.name, this.onClick.bind(this)), this.added = !0)
      }), this.on("disable", () => {
        this.added && (this.app.fire("remove_entity_from_picker", this.entity.name), this.added = !1)
      }), this.on("destroy", () => {
        this.added && (this.app.fire("remove_entity_from_picker", this.entity.name), this.added = !1)
      })
    }, o.prototype.onClick = function (h) {
      this.entity.fire("click", h), this.tinyRoot.fire("click", h)
    }
  }

  function Va(a, e) {
    class s extends a.ScriptType {
      constructor() {
        super(...arguments), this.areas = [], this.maxCheckCount = 1, this._nameInareaMap = new Map
      }
      initialize() {
        this.cameraEntity = Pt.Instance.camera, this.app.on("registerArea", this.onRegisterArea, this), this.app.on("unRegisterArea", this.onUnRegisterArea, this), this.on("destroy", () => {
          this.app.off("registerArea"), this.app.off("unRegisterArea")
        })
      }
      update(u) {
        for (let p = 0; p < this.maxCheckCount; p++) {
          let _ = this.areas.shift();
          if (!_) break;
          let g = this.checkInArea(_);
          _.inArea !== g && (_.inArea = g, this.updateNameInAreaMap(_.name, g)), this.areas.push(_)
        }
      }
      updateNameInAreaMap(u, p) {
        let _ = this._nameInareaMap.get(u);
        this._nameInareaMap.set(u, p), _ != p && (this.app.fire(p ? "enter_area" : "exit_area", u, this.areas), this.app.fire(`${p?"enter_area":"exit_area"}:${u}`, this.areas), W.log(`${p?"enter_area":"exit_area"}:${u}`))
      }
      checkInArea(u) {
        let p = u.entity.getWorldTransform().clone().invert().mul(this.cameraEntity.getWorldTransform().clone()).getTranslation();
        if (u.type === "box") return p.x >= -.5 && p.x <= .5 && p.y >= -.5 && p.y <= .5 && p.z >= -.5 && p.z <= .5;
        if (u.type === "sphere") return p.length() <= .5;
        if (u.type === "cylinder") return new a.Vec2(p.x, p.z).length() <= .5 && p.y >= -.5 && p.y <= .5
      }
      onRegisterArea(u) {
        u.inArea = !1, this.areas.push(u)
      }
      onUnRegisterArea(u) {
        this.areas = this.areas.filter(p => p.entity !== u.entity && p.name !== u.name)
      }
    }
    a.registerScript(s, "sdsAreaDetactor");
    class o extends a.ScriptType {
      initialize() {
        let u = "",
          p = "box";
        if (this.entity.model ? (this.entity.model.type == "box" ? p = "box" : this.entity.model.type == "sphere" ? p = "sphere" : this.entity.model.type == "cylinder" && (p = "cylinder"), this.entity.model.enabled = !1) : this.entity.render && (this.entity.render.type == "box" ? p = "box" : this.entity.render.type == "sphere" ? p = "sphere" : this.entity.render.type == "cylinder" && (p = "cylinder"), this.entity.render.enabled = !1), this.entity.name.toLowerCase().startsWith("area_")) {
          if (u = this.entity.name.substring(5), u.indexOf("_") == 1) {
            let _ = u.split("_");
            p = _[0] == "b" ? "box" : _[0] == "s" ? "sphere" : "cylinder", u = _[1]
          }
        } else u = this.entity.name;
        this.areaData = {
          name: u,
          type: p,
          entity: this.entity
        }, this.app.fire("registerArea", this.areaData), this.on("enable", () => {
          this.app.fire("registerArea", this.areaData)
        }), this.on("disable", () => {
          this.app.fire("unRegisterArea", this.areaData)
        }), this.on("destroy", () => {
          this.app.fire("unRegisterArea", this.areaData)
        })
      }
    }
    a.registerScript(o, "sdsMarkArea")
  }

  function $a(a, e) {
    class s extends a.ScriptType {
      constructor() {
        super(...arguments), this._inSight = null
      }
      get inSight() {
        return this._inSight
      }
      set inSight(h) {
        this._inSight !== h && (h ? (W.log("insight"), this.appEvent && this.app.fire("insight", this.target), this.tinyrootEvent && this.tinyRoot.fire("insight", this.target)) : (W.log("outsight"), this.appEvent && this.app.fire("outsight", this.target), this.tinyrootEvent && this.tinyRoot.fire("outsight", this.target)), this.arrowEntity && (this.arrowEntity.enabled = !h), this._inSight = h)
      }
      initialize() {
        this.tinyRoot = ke.bind(this)(), this._cameraEntity = Pt.Instance.camera, this._targetEntity = this.target, (this.continer.element.anchor.x != 0 || this.continer.element.anchor.y != 0 || this.continer.element.anchor.z != 1 || this.continer.element.anchor.w != 1) && W.error("continer element anchor must be 0,0,1,1"), (this.continer.element.pivot.x != 0 || this.continer.element.pivot.y != 0) && W.error("continer element pivot must be 0,0"), (this.arrowEntity.element.anchor.x != 0 || this.arrowEntity.element.anchor.y != 0 || this.arrowEntity.element.anchor.z != 0 || this.arrowEntity.element.anchor.w != 0) && W.error("arrowEntity element anchor must be 0,0,0,0"), (this.arrowEntity.element.pivot.x != .5 || this.arrowEntity.element.pivot.y != 1) && W.error("arrowEntity element pivot must be 0.5,1");
        const h = this.continer.element;
        this.clientWidth = h.width + h.margin.x + h.margin.z, this.clientHeight = h.height + h.margin.y + h.margin.w, this.minX = h.margin.x, this.maxX = this.minX + h.width, this.minY = h.margin.y, this.maxY = this.minY + h.height, this.screenCenter = new a.Vec2(this.clientWidth / 2, this.clientHeight / 2), W.log(`minX:${this.minX},maxX:${this.maxX},minY:${this.minY},maxY:${this.maxY},centerX:${this.screenCenter.x},centerY:${this.screenCenter.y}`), (!this._targetEntity || this._targetEntity.enabled === !1) && (this.arrowEntity.enabled = !1), this.appEvent && this.app.on("setFinderTarget", this.setTarget, this), this.tinyrootEvent && this.tinyRoot.on("setFinderTarget", this.setTarget, this), this.on("attr:target", (u, p) => {
          this.setTarget(u)
        }), this.on("destroy", () => {
          this.appEvent && this.app.off("setFinderTarget", this.setTarget, this), this.tinyrootEvent && this.tinyRoot.off("setFinderTarget", this.setTarget, this)
        })
      }
      setTarget(h) {
        !h || (this._targetEntity = h, this._inSight = null)
      }
      update(h) {
        if (!this._targetEntity || this._targetEntity.enabled === !1) {
          this.arrowEntity.enabled = !1;
          return
        }
        const u = this.buildAABB(this._targetEntity),
          p = u.getMax(),
          _ = u.getMin(),
          g = u.center;
        this.showDebug && this.app.drawLines([p, new a.Vec3(p.x, p.y, _.z), new a.Vec3(p.x, _.y, _.z), new a.Vec3(p.x, _.y, p.z), p, new a.Vec3(_.x, p.y, p.z), new a.Vec3(_.x, _.y, p.z), new a.Vec3(_.x, _.y, _.z), _, new a.Vec3(_.x, p.y, _.z), new a.Vec3(_.x, p.y, p.z), new a.Vec3(p.x, p.y, p.z), new a.Vec3(p.x, p.y, _.z), new a.Vec3(_.x, p.y, _.z), new a.Vec3(_.x, p.y, p.z), new a.Vec3(_.x, _.y, p.z), new a.Vec3(p.x, _.y, p.z), new a.Vec3(p.x, _.y, _.z), new a.Vec3(p.x, p.y, _.z), new a.Vec3(p.x, _.y, _.z)], new Array(20).fill(new a.Color(1, 0, 0)), !1);
        let k = this.getScreenPosition(g),
          E = k.x >= this.minX && k.x <= this.maxX && k.y >= this.minY && k.y <= this.maxY && k.z > 0;
        if (this.inSight = E, !this.inSight) {
          const D = (this.maxY - this.minY) / 2,
            B = (this.maxX - this.minX) / 2;
          let O = new a.Vec3,
            H = 0,
            Q = new a.Vec2().sub2(new a.Vec2(k.x, k.y), this.screenCenter);
          if (Q.y > 0) {
            H = -Math.atan(Q.x / Q.y) * (180 / Math.PI);
            let it = Q.x / Q.y * D;
            if (it >= -B && it <= B) O.x = this.screenCenter.x + it, O.y = this.maxY;
            else {
              let V = Q.y / Q.x * B;
              V > 0 ? (O.x = this.maxX, O.y = this.screenCenter.y + V) : (O.x = this.minX, O.y = this.screenCenter.y - V)
            }
          } else if (Q.y < 0) {
            H = -Math.atan(Q.x / Q.y) * (180 / Math.PI) - 180;
            let it = Q.x / Q.y * -D;
            if (it >= -B && it <= B) O.x = this.screenCenter.x + it, O.y = this.minY;
            else {
              let V = Q.y / Q.x * B;
              V < 0 ? (O.x = this.maxX, O.y = this.screenCenter.y + V) : (O.x = this.minX, O.y = this.screenCenter.y - V)
            }
          } else Q.x <= 0 ? (H = 90, O.x = this.minX, O.y = this.screenCenter.y) : (H = -90, O.x = this.maxX, O.y = this.screenCenter.y);
          this.arrowEntity.setLocalEulerAngles(0, 0, H), this.arrowEntity.setLocalPosition(O)
        }
      }
      buildAABB(h) {
        let u = null;
        if (h instanceof a.Entity && h.enabled) {
          let p = h.model;
          if (p) {
            let g = p.meshInstances;
            if (g)
              for (let k = 0; k < g.length; k++) u == null ? u = g[k].aabb.clone() : u.add(g[k].aabb)
          }
          let _ = h.render;
          if (_) {
            let g = _.meshInstances;
            if (g)
              for (let k = 0; k < g.length; k++) u == null ? u = g[k].aabb.clone() : u.add(g[k].aabb)
          }
        }
        for (let p = 0; p < h.children.length; ++p) {
          let _ = this.buildAABB(h.children[p]);
          _ && (u == null ? u = _.clone() : u.add(_))
        }
        return u == null && (u = new a.BoundingBox(h.getPosition())), u
      }
      getScreenPosition(h) {
        let u = new a.Vec3;
        return this._cameraEntity.camera.worldToScreen(h, u), this._cameraEntity.forward.clone().dot(h.clone().sub(this._cameraEntity.getPosition()).normalize()) >= 0 ? u.y = this.clientHeight - u.y : u.x = this.clientWidth - u.x, u
      }
    }
    a.registerScript(s, "sdsTargetFinder"), s.attributes.add("target", {
      type: "entity",
      description: "\u76EE\u6807\u7269\u4F53"
    }), s.attributes.add("screen2D", {
      type: "entity"
    }), s.attributes.add("continer", {
      type: "entity"
    }), s.attributes.add("arrowEntity", {
      type: "entity"
    }), s.attributes.add("appEvent", {
      type: "boolean",
      default: !0
    }), s.attributes.add("tinyrootEvent", {
      type: "boolean",
      default: !0
    }), s.attributes.add("showDebug", {
      type: "boolean",
      default: !1
    })
  }

  function Bi(a, e) {
    a.createScript("sdsFlag"), Ia(a), Ca(a), Fa(a), Da(a), La(a), Oa(a, e), qa(a, e), Va(a), $a(a), typeof window < "u" && Pa(a)
  }
  const gi = {
    skybox: {
      url: "https://sightp-tour-tiny-app.sightp.com/AppSettings/skybox/studio_small_09_2k-envAtlas.png",
      format: "rgbm",
      intensity: .5
    },
    layers: {
      0: {
        name: "World",
        opaqueSortMode: 2,
        transparentSortMode: 3
      },
      1: {
        name: "Depth",
        opaqueSortMode: 2,
        transparentSortMode: 3
      },
      2: {
        name: "Skybox",
        opaqueSortMode: 0,
        transparentSortMode: 3
      },
      3: {
        name: "Immediate",
        opaqueSortMode: 0,
        transparentSortMode: 3
      },
      4: {
        name: "UI",
        opaqueSortMode: 1,
        transparentSortMode: 1
      },
      1e3: {
        name: "arBg",
        opaqueSortMode: 0,
        transparentSortMode: 0
      },
      1001: {
        name: "Mask",
        opaqueSortMode: 2,
        transparentSortMode: 3
      },
      1002: {
        name: "pickerLayer",
        opaqueSortMode: 2,
        transparentSortMode: 3
      },
      1003: {
        name: "Sprit",
        opaqueSortMode: 1,
        transparentSortMode: 1
      }
    },
    layerOrder: [{
      layer: 1e3,
      transparent: !1,
      enabled: !0
    }, {
      layer: 1001,
      transparent: !0,
      enabled: !0
    }, {
      layer: 0,
      transparent: !1,
      enabled: !0
    }, {
      layer: 1,
      transparent: !1,
      enabled: !0
    }, {
      layer: 2,
      transparent: !1,
      enabled: !0
    }, {
      layer: 1003,
      transparent: !1,
      enabled: !0
    }, {
      layer: 0,
      transparent: !0,
      enabled: !0
    }, {
      layer: 1003,
      transparent: !0,
      enabled: !0
    }, {
      layer: 1002,
      transparent: !1,
      enabled: !0
    }, {
      layer: 1002,
      transparent: !0,
      enabled: !0
    }, {
      layer: 3,
      transparent: !1,
      enabled: !0
    }, {
      layer: 3,
      transparent: !0,
      enabled: !0
    }, {
      layer: 4,
      transparent: !0,
      enabled: !0
    }]
  };
  class _i {
    static async loadSkybox(e) {
      e.format || (e.format = "rgbm");
      const s = new this.pc.Asset("skybox", "texture", {
        url: e.url
      }, {
        type: e.format
      });
      this.app.assets.add(s), this.app.assets.load(s), s.on("load", () => {
        this.app.scene.skyboxMip = 1, this.app.scene.envAtlas = s.resource, this.app.scene.toneMapping = this.pc.TONEMAP_LINEAR, this.app.scene.skyboxIntensity = gi.skybox.intensity, this.app.scene.ambientLight = new this.pc.Color(.2, .2, .2)
      })
    }
    static initLayers(e, s, o) {
      const h = new this.pc.LayerComposition("application"),
        u = {};
      for (const p in e) {
        const _ = e[p];
        _.id = parseInt(p, 10), _.enabled = _.id !== this.pc.LAYERID_DEPTH, u[p] = new this.pc.Layer(_)
      }
      for (let p = 0, _ = s.length; p < _; p++) {
        const g = s[p],
          k = u[g.layer];
        !k || (g.transparent ? h.pushTransparent(k) : h.pushOpaque(k), h.subLayerEnabled[p] = g.enabled)
      }
      console.log(e, 'initLayers');
      this.app.scene.layers = h, o.layers = Object.keys(e).map(p => p == "2" ? void 0 : parseInt(p))
    }
  }
  class Pt {
    constructor() {
      this._pluginsMap = new Map, this._inited = !1, this._tinyRootMap = new Map, this.logger = W
    }
    get plugins() {
      return Array.from(this._pluginsMap.values())
    }
    get inited() {
      return this._inited
    }
    static get Instance() {
      return this.instance || (this.instance = new this)
    }
    init(e, s, o) {
      if (this._inited) {
        this.logger.warn("TinyLuncher already inited!");
        return
      }
      this.pc = e, s instanceof(this.pc.AppBase ? this.pc.AppBase : this.pc.Application) ? this.app = s : this.app = this._createApp(s), this.camera = this.app.root.findByTag("MainCamera")[0], this.camera || (this.camera = this.app.root.findByName("Camera")), this.camera || (this.camera = new this.pc.Entity("Camera"), this.camera.addComponent("camera", {
        clearColor: new this.pc.Color(0, 0, 0, 0),
        farClip: 1e3,
        nearClip: .1,
        priority: 0
      }), this.camera.tags.add("MainCamera"), this.camera.camera.layers = [this.pc.LAYERID_WORLD, this.pc.LAYERID_UI, this.pc.LAYERID_DEPTH, this.pc.LAYERID_IMMEDIATE], this.app.root.children[0].addChild(this.camera)), this.camera.addComponent("audiolistener"), _i.app = this.app, _i.pc = this.pc, _i.initLayers(gi.layers, gi.layerOrder, this.camera.camera), this.app.scripts.has("sdsFlag") || Bi(this.pc, this.app), Ht.Instance.init(this.pc, this.app, o), this.app.on("destroy", () => {
        this.logger.log("TinyLuncher destroy by app"), this.destroy()
      }), this._inited = !0, this.tinyAppRootEntity = this.app.root.findByName("TinyAppRoot"), this.tinyAppRootEntity || (this.tinyAppRootEntity = new this.pc.Entity("TinyAppRoot"), this.app.root.children[0].addChild(this.tinyAppRootEntity), this.logger.log("TinyAppRoot not found, create a new one.")), this.tinyAppRootEntity.addComponent("script"), this.tinyAppRootEntity.script.create("sdsEntityPicker"), this.tinyAppRootEntity.script.create("sdsAreaDetactor"), this.logger.log("\u521B\u5EFA TinyAppRoot \u7684 TinyRoot");
      const h = new Le(this.tinyAppRootEntity, {
        type: $t.Empty
      });
      this.tinyAppRoot = h, this._tinyRootMap.set(this.tinyAppRootEntity, h), this.plugins.forEach(u => {
        u.onTinyLuncherInited && u.onTinyLuncherInited(this, Ht.Instance)
      }), this.plugins.forEach(u => {
        u.onInitScripts && u.onInitScripts(this.pc, this.app)
      }), _i.loadSkybox(gi.skybox)
    }
    instantiateFromAnotation(e, s) {
      if (!this._inited) throw new Error("TinyLuncher is not inited!");
      if (this._tinyRootMap.has(s)) throw new Error(`entity ${s.name} already is a tinyapp root!`);
      this.plugins.forEach(h => {
        h.beforeAddTinyRoot && h.beforeAddTinyRoot(e)
      }), s || (s = new this.pc.Entity("EMA"), this.tinyAppRootEntity.addChild(s));
      const o = new zi(s, e);
      return this._tinyRootMap.set(s, o), this.plugins.forEach(h => {
        h.onAddTinyRoot && h.onAddTinyRoot(o)
      }), o
    }
    instantiateFromTinyApp(e, s, o) {
      let h = null;
      console.log(e, s, o, 'instantiateFromTinyApp');
      return typeof e == "string" ? h = {
        tinyAppUrl: e,
        loadCondition: Lt.auto,
        showCondition: Lt.auto,
        type: $t.TinyAPP
      } : h = e, this.instantiateTinyRoot(h, s, o)
    }
    instantiateTinyRoot(e, s = new this.pc.Entity, o = this.tinyAppRoot) {
      console.log(e, s, o, 'instantiateTinyRoot');
      if (!this._inited) throw new Error("TinyLuncher is not inited!");
      console.log(1111, 'instantiateTinyRoot');
      if (this._tinyRootMap.has(s)) throw new Error(`entity ${s.name} already is a tinyapp root!`);
      console.log(2222, 'instantiateTinyRoot');
      this.plugins.forEach(u => {
        u.beforeAddTinyRoot && u.beforeAddTinyRoot(e)
      }), e.name && (s.name = e.name), e.position && s.setPosition(e.position.x, e.position.y, e.position.z), e.euler && s.setEulerAngles(e.euler.x, e.euler.y, e.euler.z), e.scale && s.setLocalScale(e.scale.x, e.scale.y, e.scale.z);
      console.log(3333, 'instantiateTinyRoot');
      const h = Ra(s, e);
      console.log(4444, h, 'instantiateTinyRoot');
      console.log(4444, o.children, 'instantiateTinyRoot o.children');
      console.log(4444, s.parent, o.rootEntity, 'instantiateTinyRoot s.parent || o.rootEntity');
      console.log(4444, this._tinyRootMap, 'instantiateTinyRoot this._tinyRootMap');
      console.log(4444, this.plugins, 'instantiateTinyRoot this.plugins');
      console.log(4444, h, 'instantiateTinyRoot h');
      return h.parent = o, o.children.push(h), s.parent || o.rootEntity.addChild(s), this._tinyRootMap.set(s, h), this.plugins.forEach(u => {
        u.onAddTinyRoot && u.onAddTinyRoot(h)
      }), h
    }
    findTinyRoot(e) {
      let s = null;
      return typeof e == "string" ? (s = this._tinyRootMap.get(this.app.root.findByName(e)), s || (s = this._tinyRootMap.get(this.app.root.findByGuid(e)))) : s = this._tinyRootMap.get(e), s
    }
    removeTinyRoot(e) {
      const s = this._tinyRootMap.get(e);
      s ? (this.plugins.forEach(o => {
        o.onRemoveTinyRoot && o.onRemoveTinyRoot(s)
      }), s.unLoad(), this._tinyRootMap.delete(e), e.destroy()) : this.logger.warn("TinyRoot not found::", e.name)
    }
    addPlugin(e) {
      e.name && e.name.length > 0 ? this._pluginsMap.set(e.name, e) : this._pluginsMap.set(e.__proto__.constructor.name, e), e.onAdd && e.onAdd(), this._inited ? (this.logger.log(`\u6DFB\u52A0\u63D2\u4EF6${e.name}\uFF0C\u6267\u884C\u63D2\u4EF6\u521D\u59CB\u5316\u65B9\u6CD5`), e.onTinyLuncherInited && e.onTinyLuncherInited(this, Ht.Instance), e.onInitScripts && e.onInitScripts(this.pc, this.app), this._tinyRootMap.forEach(s => {
        e.onAddTinyRoot && e.onAddTinyRoot(s)
      })) : this.logger.log(`\u6DFB\u52A0\u63D2\u4EF6${e.name}\uFF0C\u7B49\u5F85\u7CFB\u7EDF\u521D\u59CB\u5316\u5B8C\u6210\u540E\u6267\u884C\u63D2\u4EF6\u521D\u59CB\u5316\u65B9\u6CD5`)
    }
    removePlugin(e) {
      e.name && e.name.length > 0 ? this._pluginsMap.delete(e.name) : this._pluginsMap.delete(e.__proto__.constructor.name), e.onRemove && e.onRemove()
    }
    getPlugin(e) {
      return this._pluginsMap.get(e)
    }
    destroy() {
      var e, s;
      Pt.instance != null && (this.plugins.forEach(o => {
        o.onDestroy && o.onDestroy(this, Ht.Instance)
      }), this._pluginsMap.clear(), (e = this.tinyAppRoot) == null || e.unLoad(), (s = this.tinyAppRootEntity) == null || s.destroy(), this._tinyRootMap.clear(), Pt.instance = null, Ht.Instance.release(), this.logger.log("TinyLuncher destroy sccess!"))
    }
    _createApp(e) {
      const s = new this.pc.Application(e, {
        touch: new this.pc.TouchDevice(e),
        elementInput: new this.pc.ElementInput(e, {
          useMouse: !1,
          useTouch: !0
        }),
        graphicsDeviceOptions: {
          antialias: !1,
          useDevicePixelRatio: !0,
          alpha: !0,
          preserveDrawingBuffer: !1,
          preferWebGl2: !1,
          assetPrefix: "",
          scriptPrefix: ""
        }
      });
      return typeof wx < "u" ? s.graphicsDevice.maxPixelRatio = wx.getSystemInfoSync().pixelRatio : typeof my < "u" && (s.graphicsDevice.maxPixelRatio = my.getSystemInfoSync().pixelRatio), s.setCanvasFillMode(this.pc.FILLMODE_FILL_WINDOW), s.setCanvasResolution(this.pc.RESOLUTION_AUTO), s.root.addChild(new this.pc.Entity("Root")), s.start(), s
    }
  }

  function ja(a, e, s, o = {}) {
    return new Promise(async (h, u) => {
      s.projectUrl = s.projectUrl.replace(/\/$/, "");
      const p = s.projectUrl + "/config.json",
        _ = s.projectUrl + "/__game-scripts.js";
      W.log("set up pc");
      let g = Ha(a, e, o);
      g.assets.prefix = s.projectUrl + "/", W.log("load config"), await Ga(g, p).catch(k => {
        W.error("load config error", k), u(k)
      }), s.onProgress && s.onProgress(.1), W.log("preload"), g.on("preload:progress", k => {
        s.onProgress && s.onProgress(.1 + k * .8)
      }, this), await Wa(g).catch(k => {
        W.error("preload error", k), u(k)
      }), g.on("preload:end", k => {
        g.off("preload:progress")
      }), s.loadScript && (W.log("load script"), s.loadScript(a, g)), await new Promise((k, E) => {
        s.loadScriptFromString && s.loadNetworkScripts ? (W.log("load network script"), a.http.get(_, {
          cache: !1,
          responseType: "text"
        }, (D, B) => {
          if (D) E(D);
          else {
            const O = {
              console,
              pc: a,
              app: g,
              wx: typeof wx < "u" ? wx : null,
              my: typeof my < "u" ? my : null,
              setTimeout,
              setInterval,
              clearTimeout,
              clearInterval,
              Float32Array,
              $TinyLoader: Ht.Instance,
              $TinyLuncher: Pt.Instance,
              $GetTinyRoot: function (H) {
                return ke.call(H)
              }
            };
            s.loadScriptFromString(B, O), k()
          }
        })) : k()
      }), s.onProgress && s.onProgress(.95), W.log("load scene"), await Ka(g, s.sceneName).catch(k => {
        W.error("load scene error", k), u(k)
      }), s.onProgress && s.onProgress(1), g.start(), Pt.Instance.init(a, g, s.loadScriptFromString), s.onLoaded && s.onLoaded(a, g), h()
    }).catch(h => {
      s.onError && s.onError(h)
    })
  }

  function Ha(a, e, s) {
    let o = {
      elementInput: new a.ElementInput(e, {
        useMouse: !0,
        useTouch: !0
      }),
      touch: new a.TouchDevice(e),
      mouse: new a.Mouse(e)
    };
    s = Object.assign({
      touch: o.touch,
      mouse: o.mouse,
      elementInput: o.elementInput,
      graphicsDeviceOptions: {
        antialias: !1,
        useDevicePixelRatio: !0,
        alpha: !0,
        preserveDrawingBuffer: !1,
        preferWebGl2: !1
      }
    }, s);
    let h = new a.Application(e, s);
    return typeof wx < "u" ? h.graphicsDevice.maxPixelRatio = wx.getSystemInfoSync().pixelRatio : typeof my < "u" && (h.graphicsDevice.maxPixelRatio = my.getSystemInfoSync().pixelRatio), h.setCanvasFillMode(a.FILLMODE_FILL_WINDOW), h.setCanvasResolution(a.RESOLUTION_AUTO), h
  }

  function Ga(a, e) {
    return new Promise((s, o) => {
      a.configure(e, h => {
        h ? o(h) : s()
      })
    })
  }

  function Wa(a) {
    return new Promise((e, s) => {
      a.preload(o => {
        o ? s(o) : e()
      })
    })
  }

  function Ka(a, e) {
    return new Promise((s, o) => {
      a.scenes.loadScene(e, (h, u) => {
        h ? o(h) : s(u)
      })
    })
  }
  class Ya {
    constructor(e) {
      this.name = "BlockController", this.entitys = [], W.error("BlockController \u5DF2\u9057\u5F03\uFF0C\u4F7F\u7528 ARManager \u5E93\u4E0D\u9700\u8981\u4F7F\u7528\u6B64\u7C7B\u3002"), this.blockConfig = e
    }
    onClsResult(e) {
      setTimeout(() => {
        this.app && this.app.fire("clsResult", e)
      }, 34)
    }
    setBlockTransform(e) {
      this.blockConfig = e, this.entitys.forEach(s => {
        s.fire("setBlockTransform", e)
      })
    }
    onInitScripts(e, s) {
      let o = this;
      this.pc = e, this.app = s;
      let h = e.createScript("sdsBlockController", s);
      h.prototype.initialize = function () {
        W.log("sdsBolockController initialize"), this.app.on("clsResult", this.onClsResult, this), this.entity.on("setBlockTransform", this.setBlockTransform, this), this.on("destroy", function () {
          this.app.off("clsResult", this.onClsResult, this), this.entity.off("setBlockTransform", this.setBlockTransform, this)
        }), this.blockMap = new Map, this.entity.children.forEach(u => {
          u.enabled = !1, this.blockMap.set(u.name, u)
        }), o.blockConfig && o.blockConfig.length > 0 && this.setBlockTransform(o.blockConfig)
      }, h.prototype.onClsResult = function (u) {
        let p = u.mapId;
        this.blockMap.forEach((_, g) => {
          g == p ? _.enabled = !0 : _.enabled = !1
        })
      }, h.prototype.setBlockTransform = function (u) {
        W.log("start set block transform"), u.forEach(p => {
          if (this.blockMap.has(p.id)) {
            let _ = this.blockMap.get(p.id);
            _.setPosition(p.transform.position.x, p.transform.position.y, p.transform.position.z), _.setRotation(p.transform.rotation.x, p.transform.rotation.y, p.transform.rotation.z, p.transform.rotation.w), _.setLocalScale(p.transform.scale.x, p.transform.scale.y, p.transform.scale.z), W.log(`set ${p.id} transform.p:${p.transform.position}  r:${p.transform.rotation}  r:${p.transform.scale}`)
          }
        })
      }
    }
    onAddTinyRoot(e) {
      e.rawData.type == "Annotation" && (e.rootEntity.script || e.rootEntity.addComponent("script"), e.rootEntity.script.has("sdsBlockController") || (e.rootEntity.script.create("sdsBlockController"), this.entitys.push(e.rootEntity)))
    }
    onRemove() {
      this.entitys.forEach(e => {
        e.script.destroy("sdsBlockController")
      }), this.entitys = []
    }
  }
  class Ss {
    constructor(e) {
      this.name = "AssistantPlugin", this.isReady = !1, typeof e == "string" ? this.tinyAPPUrl = e : (this.tinyAppData = e, this.tinyAppData.name || (this.tinyAppData.name = "assistant"), this.tinyAppData.type || (this.tinyAppData.type = $t.TinyAPP), this.tinyAppData.externalData = {
        type: "assistant"
      })
    }
    onTinyLuncherInited(e, s) {
      (this.tinyAPPUrl || this.tinyAppData) && !this.assistantTinyRoot && (W.log("create assistant and start load at next frame"), setTimeout(() => {
        let o = new e.pc.Entity("vioBlock");
        this._vioBlock = o;
        let h = new e.pc.Entity("assistant");
        this._assistantEntity = h, this._tinyappRootEntity = e.tinyAppRootEntity, e.tinyAppRootEntity.addChild(o), o.addChild(h), e.app.fire("rejesterBlock", "VIO", o), this.tinyAPPUrl ? this.assistantTinyRoot = e.instantiateFromTinyApp({
          type: $t.TinyAPP,
          name: "assistant",
          tinyAppUrl: this.tinyAPPUrl,
          loadCondition: Lt.auto,
          showCondition: Lt.auto,
          externalData: {
            type: "assistant"
          }
        }, h, e.tinyAppRoot) : this.assistantTinyRoot = e.instantiateFromTinyApp(this.tinyAppData, h, e.tinyAppRoot), e.app.once("localize_sucess", () => {
          console.error("localize_sucess"), this.reparentToTinyAppRoot()
        })
      }, 30))
    }
    onAddTinyRoot(e) {
      if (e.externalData && e.externalData.type == "assistant") {
        if (W.log("add a Assistant"), !this.assistantTinyRoot) this.assistantTinyRoot = e;
        else {
          W.error("already has a assistant.try add another one:", e.rootEntity.name);
          return
        }
        this.assistantTinyRoot.on("loaded", () => {
          let s = e.rootEntity.children[0],
            o = 0;
          for (; o < 5 && (s.script && s.script.sdsAssistant && (this.sdsAssistant = s.script.sdsAssistant), !this.sdsAssistant);) s = s.children[0], o++;
          if (!this.sdsAssistant) {
            W.error("can not find sdsAssistant");
            return
          }
          this.isReady = !0, this.onReady && this.onReady()
        })
      }
    }
    onDestroy(e, s) {
      this.sdsAssistant = null, this.assistantTinyRoot = null, this.isReady = !1, this.onReady = null
    }
    reparentToTinyAppRoot() {
      this._assistantEntity && this._tinyappRootEntity && this._reparentEntityKeepWorldTransform(this._assistantEntity, this._tinyappRootEntity), console.error("reparentToTinyAppRoot")
    }
    reparentToVioBlock() {
      this._assistantEntity && this._vioBlock && this._reparentEntityKeepWorldTransform(this._assistantEntity, this._vioBlock)
    }
    _reparentEntityKeepWorldTransform(e, s) {
      const o = e.getPosition().clone(),
        h = e.getRotation().clone(),
        u = e.getWorldTransform().getScale().clone();
      e.reparent(s), e.setPosition(o), e.setRotation(h), e.setLocalScale(u)
    }
  }
  class Xa {
    constructor(e) {
      this.gl = e, this._dt = null, this._program = null, this._vao = null, this._vao_ext = null
    }
    get program() {
      return this._program
    }
    set program(e) {
      this._program = e
    }
    initGL() {
      this.initShader(), this.initVAO()
    }
    initShader() {
      const e = this.gl,
        s = e.getParameter(e.CURRENT_PROGRAM),
        o = `
        attribute vec2 a_position;
        attribute vec2 a_texCoord;
        uniform mat3 displayTransform;
        varying vec2 v_texCoord;
        void main() {
          vec3 p = displayTransform * vec3(a_position, 0.0);
          gl_Position = vec4(p, 1.0);
          v_texCoord = a_texCoord;
        }
      `,
        h = `
        precision highp float;

        uniform sampler2D y_texture;
        uniform sampler2D uv_texture;
        varying vec2 v_texCoord;
        void main() {
          vec4 y_color = texture2D(y_texture, v_texCoord);
          vec4 uv_color = texture2D(uv_texture, v_texCoord);

          float Y, U, V;
          float R ,G, B;
          Y = y_color.r;
          U = uv_color.r - 0.5;
          V = uv_color.a - 0.5;
          
          R = Y + 1.402 * V;
          G = Y - 0.344 * U - 0.714 * V;
          B = Y + 1.772 * U;
          
          gl_FragColor = vec4(R, G, B, 1.0);
        }
      `,
        u = e.createShader(e.VERTEX_SHADER);
      e.shaderSource(u, o), e.compileShader(u);
      const p = e.createShader(e.FRAGMENT_SHADER);
      e.shaderSource(p, h), e.compileShader(p);
      const _ = this._program = e.createProgram();
      this._program.gl = e, e.attachShader(_, u), e.attachShader(_, p), e.deleteShader(u), e.deleteShader(p), e.linkProgram(_), e.useProgram(_);
      const g = e.getUniformLocation(_, "y_texture");
      e.uniform1i(g, 5);
      const k = e.getUniformLocation(_, "uv_texture");
      e.uniform1i(k, 6), this._dt = e.getUniformLocation(_, "displayTransform"), e.useProgram(s)
    }
    initVAO() {
      const e = this.gl,
        s = e.getExtension("OES_vertex_array_object");
      this._vao_ext = s;
      const o = e.getParameter(e.VERTEX_ARRAY_BINDING),
        h = s.createVertexArrayOES();
      s.bindVertexArrayOES(h);
      const u = e.getAttribLocation(this._program, "a_position"),
        p = e.createBuffer();
      e.bindBuffer(e.ARRAY_BUFFER, p), e.bufferData(e.ARRAY_BUFFER, new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]), e.STATIC_DRAW), e.vertexAttribPointer(u, 2, e.FLOAT, !1, 0, 0), e.enableVertexAttribArray(u), h.posBuffer = p;
      const _ = e.getAttribLocation(this._program, "a_texCoord"),
        g = e.createBuffer();
      e.bindBuffer(e.ARRAY_BUFFER, g), e.bufferData(e.ARRAY_BUFFER, new Float32Array([1, 1, 0, 1, 1, 0, 0, 0]), e.STATIC_DRAW), e.vertexAttribPointer(_, 2, e.FLOAT, !1, 0, 0), e.enableVertexAttribArray(_), h.texcoordBuffer = g, s.bindVertexArrayOES(o), this._vao = h
    }
    renderGL(e) {
      const s = this.gl;
      s.disable(s.DEPTH_TEST);
      const {
        yTexture: o,
        uvTexture: h
      } = e.getCameraTexture(s), u = e.getDisplayTransform();
      if (o && h) {
        const p = s.getParameter(s.CURRENT_PROGRAM),
          _ = s.getParameter(s.ACTIVE_TEXTURE),
          g = s.getParameter(s.VERTEX_ARRAY_BINDING);
        s.useProgram(this._program), this._vao_ext.bindVertexArrayOES(this._vao), s.uniformMatrix3fv(this._dt, !1, u), s.pixelStorei(s.UNPACK_ALIGNMENT, 1), s.activeTexture(s.TEXTURE0 + 5);
        const k = s.getParameter(s.TEXTURE_BINDING_2D);
        s.bindTexture(s.TEXTURE_2D, o), s.activeTexture(s.TEXTURE0 + 6);
        const E = s.getParameter(s.TEXTURE_BINDING_2D);
        s.bindTexture(s.TEXTURE_2D, h), s.drawArrays(s.TRIANGLE_STRIP, 0, 4), s.bindTexture(s.TEXTURE_2D, E), s.activeTexture(s.TEXTURE0 + 5), s.bindTexture(s.TEXTURE_2D, k), s.useProgram(p), s.activeTexture(_), this._vao_ext.bindVertexArrayOES(g)
      }
    }
    clearGL() {
      const e = this.gl;
      e.clearColor(0, 0, 0, 0), e.clear(e.COLOR_BUFFER_BIT), e.clear(e.DEPTH_BUFFER_BIT), e.clear(e.STENCIL_BUFFER_BIT)
    }
    destroy() {
      this._program && this._program.gl && (this.clearGL(), this._program.gl.deleteProgram(this._program), this._program = null, this.gl = null)
    }
  }
  class Qa {
    constructor(e, s = {
      useMarker: !1,
      useCls: !1
    }) {
      this.name = "vkTinyPlugin", this._markersMap = new Map, this.canvas = e, this.gl = e.getContext("webgl"), this._setting = s, this._captureCanvas = wx.createOffscreenCanvas({
        type: "2d",
        width: e.width,
        height: e.height
      });
      const o = setInterval(() => {
        if (this._captureCanvas) {
          clearInterval(o);
          return
        }
        W.warn("create offscreen canvas fail, retry create"), this._captureCanvas = wx.createOffscreenCanvas({
          type: "2d",
          width: e.width,
          height: e.height
        })
      }, 60)
    }
    onTinyLuncherInited(e, s) {
      this.tinyLuncher = e, this.pc = s.pc, this.app = e.app, this.cameraEntity = e.camera, this.vkVersion = wx.isVKSupport("v2") ? "v2" : "v1", W.log("support version ", this.vkVersion), this._vkSessionStartPromise = new Promise((o, h) => {
        this.vkSession = wx.createVKSession({
          track: {
            plane: {
              mode: 1
            },
            marker: this._setting.useMarker
          },
          version: this.vkVersion,
          gl: this.gl
        }), this.vkSession.start(u => {
          if (u) return h(u), W.error("AR error", u);
          W.log("start vk session"), this.app.fire("vkSessionStart"), this.yuv = new Xa(this.gl), this.yuv.initGL(), this.app.xr.session || (W.log("\u5173\u95ED App3d \u81EA\u52A8\u5237\u65B0"), this.app.xr = {
            session: {
              requestAnimationFrame: () => {}
            },
            end: () => {},
            destroy: () => {}
          }), this._frameRequestId = this.vkSession.requestAnimationFrame(() => {
            this._onFrame()
          }), this._setting.useMarker && (this.vkSession.on("addAnchors", this._onAddAnchors.bind(this)), this.vkSession.on("removeAnchors", this._onRemoveAnchors.bind(this)), this.vkSession.on("updateAnchors", this._onUpdateAnchors.bind(this))), o()
        })
      })
    }
    onInitScripts(e, s) {
      let o = this;
      class h extends e.ScriptType {
        initialize() {
          this.tinyRoot = o.tinyLuncher.findTinyRoot(this.entity), this.tinyRoot || this.entity.on("inited", p => {
            this.tinyRoot = p
          }), this.app.on(`addMarkerAnchor:${this.markerId}`, p => {
            !this.tinyRoot.loaded && !this.tinyRoot.loading && this.tinyRoot.load(() => {
              this.tinyRoot.setActive(!0)
            }), this.tinyRoot.setActive(!0), this.app.fire("showmodel", this.entity), this.updateTransform(p.transform), W.log("add marker anchor")
          }), this.app.on(`updateMarkerAnchor:${this.markerId}`, p => {
            this.tinyRoot.active === !1 && Date.now() - this._lastHideTime > 1e3 && (this.tinyRoot.setActive(!0), this.app.fire("showmodel", this.entity.name), this.updateTransform(p.transform)), this.updateTransform(p.transform), this._lastUpdateTime = Date.now()
          }), this.app.on(`removeMarkerAnchor:${this.markerId}`, p => {
            this.tinyRoot.setActive(!1), this.app.fire("hidemodel", this.entity), o._currentMarkerAnchor = null, W.log("remove marker anchor")
          }), this.entity.on("removeMarker", () => {
            this._lastHideTime = Date.now(), this.tinyRoot.setActive(!1), this.app.fire("hidemodel", this.entity), o._currentMarkerAnchor = null, W.log("remove marker anchor")
          })
        }
        update(p) {
          let _ = Date.now();
          this._lastUpdateTime && _ - this._lastUpdateTime > 1e4 && !this.keep && (this.tinyRoot.setActive(!1), this.app.fire("hidemodel", this.entity), o._currentMarkerAnchor = null, this._lastHideTime = Date.now(), this._lastUpdateTime = null)
        }
        updateTransform(p) {
          let _ = new e.Mat4;
          _.set(Array.from(p)), this.entity.setPosition(_.getTranslation()), this.tinyRoot.externalData.r && this.entity.setRotation(new e.Quat().setFromMat4(_)), this.tinyRoot.externalData.s && this.entity.setLocalScale(_.getScale())
        }
      }
      e.registerScript(h, "bindMarker", s), h.attributes.add("markerId", {
        type: "number",
        default: -1
      }), h.attributes.add("keep", {
        type: "boolean",
        default: !0
      })
    }
    onAddTinyRoot(e) {
      if (e.externalData && e.externalData.type == "vkMarker") {
        let s = e.externalData;
        this.addMarker(s.imgUrl).then(o => {
          e.rootEntity.script.create("bindMarker", {
            attributes: {
              markerId: o,
              keep: e.externalData.keep != null ? e.externalData.keep : !0
            }
          })
        }).catch(o => {
          W.error(o)
        })
      }
    }
    onRemove() {
      W.log("remove vk session");
      let e = wx.getFileSystemManager();
      this.app && (this.app.xr.session = null), this.vkSession && (this._markersMap.forEach(s => {
        this.vkSession.removeMarker(s.id), e.unlink({
          filePath: s.filePath,
          success: () => {
            W.log("delete file success", s.filePath)
          },
          fail: o => {
            W.log("delete file fail", s.filePath, o)
          }
        })
      }), this._markersMap.clear(), this.vkSession.off("addAnchors", this._onAddAnchors.bind(this)), this.vkSession.off("removeAnchors", this._onRemoveAnchors.bind(this)), this.vkSession.off("updateAnchors", this._onUpdateAnchors.bind(this)), this.vkSession.cancelAnimationFrame(this._frameRequestId), this.vkSession.stop(), this.vkSession.destroy(), this.vkSession = null), this.yuv && (this.yuv.destroy(), this.yuv = null)
    }
    onDestroy(e, s) {
      W.log("destroy vk session");
      let o = wx.getFileSystemManager();
      this.vkSession && (this._markersMap.forEach(h => {
        this.vkSession.removeMarker(h.id), o.unlink({
          filePath: h.filePath,
          success: () => {
            W.log("delete file success", h.filePath)
          },
          fail: u => {
            W.log("delete file fail", h.filePath, u)
          }
        })
      }), this._markersMap.clear(), this.vkSession.off("addAnchors", this._onAddAnchors.bind(this)), this.vkSession.off("removeAnchors", this._onRemoveAnchors.bind(this)), this.vkSession.off("updateAnchors", this._onUpdateAnchors.bind(this)), this.vkSession.cancelAnimationFrame(this._frameRequestId), this.vkFrame = null, this.vkSession.stop(), this.vkSession.destroy(), this.vkSession = null), this.yuv && (this.yuv.destroy(), this.yuv = null), this.canvas = null, this.gl = null
    }
    addMarker(e) {
      return new Promise((s, o) => {
        if (!this.vkSession) return o(-1);
        let h = e.split("/").pop(),
          u = `${wx.env.USER_DATA_PATH}/${h}`,
          p = -1,
          _ = wx.getFileSystemManager();
        ((g, k) => new Promise((E, D) => {
          _.stat({
            path: k,
            success: B => {
              B.stats.isFile() && (W.log("file exist", k), E(k))
            },
            fail: B => {
              W.log("file not exist", k), wx.downloadFile({
                url: g,
                filePath: k,
                success: O => {
                  O.statusCode === 200 && (W.log("download success", O.filePath), E(O.filePath))
                },
                fail: O => {
                  W.log("download fail", O), D(O)
                }
              })
            }
          })
        }))(e, u).then(g => {
          this._vkSessionStartPromise.then(() => {
            p = this.vkSession.addMarker(g), p > -1 ? (W.log("add marker success", p, {
              url: e,
              filePath: g,
              id: p
            }), s(p), this._markersMap.set(p, {
              url: e,
              filePath: g,
              id: p
            })) : o(p)
          })
        }).catch(g => {
          o(g)
        })
      })
    }
    removeMarker(e) {
      !this.vkSession || (this.vkSession.removeMarker(e), this._markersMap.delete(e))
    }
    stopSession() {
      !this.vkSession || (this.app.fire("vkSessionStop"), this.vkSession.cancelAnimationFrame(this._frameRequestId), this.vkFrame = null, this.vkSession.stop())
    }
    restartSession() {
      !this.vkSession || this.vkSession.start(e => {
        if (e) return W.error("AR error", e);
        this.app.fire("vkSessionStart"), W.log("start vk session"), this._frameRequestId = this.vkSession.requestAnimationFrame(() => {
          this._onFrame()
        })
      })
    }
    takePhoto() {
      return new Promise(async (e, s) => {
        wx.showLoading({
          title: "\u7167\u7247\u751F\u6210\u4E2D..."
        });
        let o = this._captureCanvas.getContext("2d"),
          h = await Promise.all([this._getDrawBuffer(this.gl), this._getDrawBuffer(this.app.graphicsDevice.gl)]),
          u = h[0],
          p = h[1];
        for (let k = 0; k < u.data.byteLength; k += 4) {
          let E = p.data[k + 3] / 255;
          u.data[k] = u.data[k] * (1 - E) + p.data[k] * E, u.data[k + 1] = u.data[k + 1] * (1 - E) + p.data[k + 1] * E, u.data[k + 2] = u.data[k + 2] * (1 - E) + p.data[k + 2] * E, u.data[k + 3] = 255
        }
        this._flip(u.data, u.width, u.height, 4), o.clearRect(0, 0, this._captureCanvas.width, this._captureCanvas.height);
        let _ = this._captureCanvas.createImageData(new Uint8ClampedArray(u.data), u.width, u.height);
        o.putImageData(_, 0, 0);
        let g = this._captureCanvas.toDataURL("image/jpeg", .9);
        e(g), wx.hideLoading()
      })
    }
    _getDrawBuffer(e) {
      const s = e;
      return new Promise((o, h) => {
        this.app.once("frameend", () => {
          const u = s.drawingBufferWidth,
            p = s.drawingBufferHeight;
          let _ = new Uint8Array(u * p * 4);
          s.readPixels(0, 0, u, p, s.RGBA, s.UNSIGNED_BYTE, _), o({
            width: u,
            height: p,
            data: _
          })
        })
      })
    }
    _onFrame() {
      const e = this.vkSession.getVKFrame(this.canvas.width, this.canvas.height);
      e && (this.vkFrame = e, this.app.once("frameupdate", () => {
        let s = new this.pc.Mat4;
        s.set(Array.from(e.camera.viewMatrix)), s.invert(), this.cameraEntity.setPosition(s.getTranslation()), this.cameraEntity.setRotation(new this.pc.Quat().setFromMat4(s)), this.cameraEntity.setLocalScale(s.getScale());
        let o = e.camera.getProjectionMatrix(this.cameraEntity.camera.nearClip, this.cameraEntity.camera.farClip);
        this.cameraEntity.camera.projectionMatrix.set(Array.from(o)), this.yuv.renderGL(e)
      }), this.app.tick()), this._frameRequestId = this.vkSession.requestAnimationFrame(() => {
        this._onFrame()
      })
    }
    _onAddAnchors(e) {
      e.forEach(s => {
        s.type === 0 ? this.app.fire("addPlaneAnchor", s) : s.type === 1 ? this._currentMarkerAnchor || (this.app.fire(`addMarkerAnchor:${s.markerId}`, s), this.app.fire("addMarkerAnchor", s.markerId, s), this._currentMarkerAnchor = s) : s.type === 2 && (this.app.fire(`addOSDAnchor:${s.markerId}`, s), this.app.fire("addOSDAnchor", s.markerId, s))
      })
    }
    _onUpdateAnchors(e) {
      e.forEach(s => {
        s.type === 0 ? this.app.fire("updatePlaneAnchor", s) : s.type === 1 ? this.app.fire(`updateMarkerAnchor:${s.markerId}`, s) : s.type === 2 && this.app.fire(`updateOSDAnchor:${s.markerId}`, s)
      })
    }
    _onRemoveAnchors(e) {
      e.forEach(s => {
        s.type === 0 ? this.app.fire("removePlaneAnchor", s) : s.type === 1 ? this.app.fire(`removeMarkerAnchor:${s.markerId}`, s) : s.type === 2 && this.app.fire(`removeOSDAnchor:${s.markerId}`, s)
      })
    }
    _flip(e, s, o, h) {
      if (Array.isArray(e)) {
        for (var u = this._flip(new Uint8Array(e), s, o, h), p = 0; p < e.length; p++) e[p] = u[p];
        return e
      }
      if (!s || !o) throw Error("Bad dimensions");
      h || (h = e.length / (s * o));
      var _ = o >> 1,
        g = s * h;
      e.constructor;
      for (var k = new Uint8Array(s * h), E = 0; E < _; ++E) {
        var D = E * g,
          B = (o - E - 1) * g;
        k.set(e.subarray(D, D + g)), e.copyWithin(D, B, B + g), e.set(k, B)
      }
      return e
    }
  }
  class Ja {
    constructor(e, s) {
      this.name = "CanvasFontPlugin", this.fontName = "Arial", this.canvas2D = e, s && (this.fontName = s)
    }
    onTinyLuncherInited(e, s) {
      this.pc = e.pc, this.app = e.app, this.canvasFont = new this.pc.CanvasFont(this.app, {
        color: new this.pc.Color(1, 1, 1),
        fontName: this.fontName,
        fontSize: 64,
        width: 1024,
        height: 1024,
        miniCanvas2D: this.canvas2D
      }), this.canvasFont.createTextures("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"), this.app.fire("canvasFontInited", this.canvasFont)
    }
    onDestroy(e, s) {
      this.canvasFont.destroy(), this.canvas2D = null
    }
  }
  const Es = class {
    constructor(a) {
      this.name = "VideoManagerPlugin", this.videoMap = new Map, this.textureMap = new Map, this.videoInfoList = [], this.wxCtx = a
    }
    onTinyLuncherInited(a, e) {
      this.pc = a.pc, this.app = a.app, this.app.off("videoplayer"), this.app.on("videoplayer", this.onVideoPlayer.bind(this)), this.app.on("pasuevideo", this.pasueVideo.bind(this)), this.app.on("playvideo", this.playVideo.bind(this)), this.app.on("stopvideo", this.stopVideo.bind(this)), this.app.on("restartvideo", this.restartVideo.bind(this)), this.app.on("destroyvideo", this.destroyVideo.bind(this)), this.app.on("destroyallvideo", this.destroyAllVideo.bind(this))
    }
    onDestroy(a, e) {
      this.destroy()
    }
    createVideoDecoder(a) {
      return new Rs(a, this.app, this.wxCtx)
    }
    onFrameReady(a, e) {
      if (this.videoMap.get(e)) {
        let s = this.textureMap.get(e);
        s ? (s.lock().set(a.data), s.unlock()) : (s = new this.pc.Texture(this.app.graphicsDevice, {
          width: a.width,
          height: a.height,
          mipmaps: !1,
          format: this.pc.PIXELFORMAT_R8_G8_B8_A8
        }), s.magFilter = this.pc.FILTER_LINEAR, s.minFilter = this.pc.FILTER_LINEAR, s.addressU = this.pc.ADDRESS_CLAMP_TO_EDGE, s.addressV = this.pc.ADDRESS_CLAMP_TO_EDGE, s.flipY = !0, console.log("setVideoTexture", s, e), this.app.fire("setVideoTexture", s, e), this.textureMap.set(e, s))
      }
    }
    onVideoPlayer(a, e) {
      e || (e = "video" + Es.idMaker++), this.videoMap.has(e) || (this.videoInfoList.push({
        id: e,
        src: a
      }), this.wxCtx.setData({
        videoInfoList: this.videoInfoList
      }))
    }
    pasueVideo(a) {
      const e = this.videoMap.get(a);
      e && e.pasue()
    }
    playVideo(a) {
      const e = this.videoMap.get(a);
      e && e.play()
    }
    stopVideo(a) {
      const e = this.videoMap.get(a);
      e && e.stop()
    }
    restartVideo(a) {
      const e = this.videoMap.get(a);
      e && e.restart()
    }
    destroyVideo(a) {
      const e = this.videoMap.get(a);
      e && (e.destroy(), this.videoMap.delete(a), this.textureMap.delete(a)), this.videoInfoList = this.videoInfoList.filter(s => s.id != a), this.wxCtx.setData({
        videoInfoList: this.videoInfoList
      })
    }
    destroyAllVideo() {
      this.videoMap.forEach(a => {
        a.destroy()
      }), this.videoMap.clear(), this.textureMap.clear()
    }
    onSourceVideoMetaDataLoaded(a) {
      let e = a.target.id;
      if (this.videoMap.has(e)) return;
      let s = a.detail.width,
        o = a.detail.height,
        h = this.videoMap.get(e);
      h || (h = this.createVideoDecoder(e), this.videoMap.set(e, h), h.setInputSize(s, o), h.setOutputSize(s, o)), h.start(this.onFrameReady.bind(this))
    }
    destroy() {
      this.destroyAllVideo(), this.videoMap.clear(), this.textureMap.clear(), this.app.off("videoplayer"), this.app.off("pasuevideo"), this.app.off("playvideo"), this.app.off("stopvideo"), this.app.off("restartvideo"), this.app.off("destroyvideo"), this.app.off("destroyallvideo"), this.videoInfoList = [], this.wxCtx.setData({
        videoInfoList: this.videoInfoList
      })
    }
  };
  let Ts = Es;
  Ts.idMaker = 100;
  class Rs {
    constructor(e, s, o) {
      this._decoding = !1, this.decodingAFrame = !1, this.videoId = e, this.app = s;
      const h = new Promise(p => {
          wx.createSelectorQuery().in(o).select(`#${e+"canvas"}`).node().exec(_ => {
            console.log("get canvas", _), this._canvas = _[0].node, this._decodeCtx = this._canvas.getContext("2d"), p(this._canvas)
          })
        }),
        u = new Promise(p => {
          wx.createSelectorQuery().in(o).select(`#${e}`).context(_ => {
            console.log("get video ctx:", _.context), this._videoCtx = _.context, p(this._videoCtx)
          }).exec()
        });
      this._readyPromise = Promise.all([h, u])
    }
    get isDecoding() {
      return this._decoding
    }
    get decodeCtx() {
      return this._decodeCtx
    }
    setInputSize(e, s) {
      this._readyPromise.then(() => {
        this._inputWidth = e, this._inputHeight = s
      })
    }
    setOutputSize(e, s) {
      this._readyPromise.then(() => {
        this._canvas.width = e, this._canvas.height = s
      })
    }
    start(e) {
      this._readyPromise.then(() => {
        this._videoCtx.play(), this._decoding = !0, this._onFrameReady = e, this.app.on("update", () => {
          this._tick()
        }, this)
      })
    }
    _tick() {
      this._decoding && this.decode()
    }
    decode() {
      if (!(!this._decodeCtx || !this._videoCtx) && !this.decodingAFrame) {
        if (this.decodingAFrame = !0, this._decodeCtx.drawImage(this._videoCtx, 0, 0, this._inputWidth, this._inputHeight, 0, 0, this._canvas.width, this._canvas.height), this._onFrameReady) {
          const e = this._decodeCtx.getImageData(0, 0, this._canvas.width, this._canvas.height);
          this._onFrameReady(e, this.videoId)
        }
        this.decodingAFrame = !1
      }
    }
    restart() {
      this._videoCtx.seek(0), this._videoCtx.play(), this._decoding = !0
    }
    play() {
      this._videoCtx.play(), this._decoding = !0
    }
    pasue() {
      this._videoCtx.pause(), this._decoding = !1, this.app.off("update", this._tick, this)
    }
    stop() {
      this._videoCtx.stop(), this._decoding = !1, this.app.off("update", this._tick, this)
    }
    destroy() {
      this.app.off("update", this._tick, this), this.app = null, this._videoCtx.stop(), this._decoding = !1, this._canvas = null, this._decodeCtx = null, this._videoCtx = null, this._onFrameReady = null
    }
  }

  function Za(a) {
    return ke.call(a)
  }
  const tr = Ht.Instance,
    er = Pt.Instance;
  typeof window < "u" && (window.$TinyLoader = Ht.Instance, window.$TinyLuncher = Pt.Instance, window.$GetTinyRoot = function (a) {
    return ke.call(a)
  }, window.pc && Bi(window.pc, window.pc.app)), console.log("use tiny-runtime v0.9.8");
  var Oi = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};

  function ir(a) {
    throw new Error('Could not dynamically require "' + a + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')
  }
  var fi = {
    exports: {}
  };
  (function (a, e) {
    (function (s, o) {
      o(e)
    })(Oi, function (s) {
      var o = (l => (l[l.None = 0] = "None", l[l.Camera = 1] = "Camera", l[l.Dof3 = 2] = "Dof3", l[l.Dof6 = 3] = "Dof6", l))(o || {}),
        h = (l => (l[l.ARSession = 1] = "ARSession", l[l.EasyAR = 2] = "EasyAR", l[l.VKSession = 3] = "VKSession", l[l.BaseCamera = 4] = "BaseCamera", l))(h || {}),
        u = (l => (l.WorldTracking = "worldTracking", l.OrientationTracking = "orientationTracking", l.CAMERA = "camera", l))(u || {}),
        p = (l => (l[l.ERROR = 0] = "ERROR", l[l.WARN = 1] = "WARN", l[l.INFO = 2] = "INFO", l[l.DEBUG = 3] = "DEBUG", l))(p || {});
      class _ {
        constructor(t = 2) {
          this.level = t
        }
        setLevel(t) {
          this.level = t
        }
        _log(t = 2, ...i) {
          if (t <= this.level) switch (t) {
            case 0:
              console.error(`[ARManager:${p[t]}]`, ...i);
              break;
            case 1:
              console.warn(`[ARManager:${p[t]}]`, ...i);
              break;
            case 2:
              console.info(`[ARManager:${p[t]}]`, ...i);
              break;
            case 3:
              console.log(`[ARManager:${p[t]}]`, ...i);
              break
          }
        }
        error(...t) {
          this._log(0, ...t)
        }
        warn(...t) {
          this._log(1, ...t)
        }
        info(...t) {
          this._log(2, ...t)
        }
        log(...t) {
          this._log(3, ...t)
        }
      }
      const g = new _(2);
      var k = (l => (l.Wechat = "Wechat", l))(k || {});
      const E = "2.0.10";

      function D(l) {
        return (t, i = null) => {
          let r = !1;
          l(n => {
            if (!r) return r = !0, t.call(i, n)
          }, null)
        }
      }

      function B(l) {
        return new Promise(t => D(l)(t))
      }

      function O(l) {
        const t = new V;
        return l.then(i => {
          t.fire(i)
        }, () => {
          t.fire(void 0)
        }), t.event
      }

      function H(l, t) {
        return l(i => t(i))
      }
      let Q = 0;
      class it {
        constructor(t) {
          this.value = t, this.id = Q++
        }
      }
      class V {
        constructor() {
          this._disposed = !1, this._size = 0, this._deliveryQueue = new nt
        }
        dispose() {
          var t;
          this._disposed || (this._disposed = !0, ((t = this._deliveryQueue) == null ? void 0 : t.current) === this && this._deliveryQueue.reset(), this._listeners && (this._listeners = void 0, this._size = 0))
        }
        get event() {
          return this._event != null || (this._event = (t, i) => {
            if (this._disposed) return;
            i && (t = t.bind(i));
            const r = new it(t);
            this._listeners ? this._listeners instanceof it ? (this._deliveryQueue != null || (this._deliveryQueue = new nt), this._listeners = [this._listeners, r]) : this._listeners.push(r) : this._listeners = r, this._size++
          }), this._event
        }
        _deliver(t, i) {
          if (t) try {
            t.value(i)
          } catch {}
        }
        _deliverQueue(t) {
          const i = t.current._listeners;
          for (; t.i < t.end;) this._deliver(i[t.i++], t.value);
          t.reset()
        }
        fire(t) {
          var i;
          if ((i = this._deliveryQueue) != null && i.current && this._deliverQueue(this._deliveryQueue), this._listeners)
            if (this._listeners instanceof it) this._deliver(this._listeners, t);
            else {
              const r = this._deliveryQueue;
              r.enqueue(this, t, this._listeners.length), this._deliverQueue(r)
            }
        }
        hasListeners() {
          return this._size > 0
        }
      }
      class nt {
        constructor() {
          this.i = -1, this.end = 0
        }
        enqueue(t, i, r) {
          this.i = 0, this.end = r, this.current = t, this.value = i
        }
        reset() {
          this.i = this.end, this.current = void 0, this.value = void 0
        }
      }
      const ct = Object.freeze(Object.defineProperty({
        __proto__: null,
        once: D,
        toPromise: B,
        fromPromise: O,
        makeSubscription: H,
        Emitter: V
      }, Symbol.toStringTag, {
        value: "Module"
      }));
      class Ct {
        constructor() {
          this._handler = null, this._externalControlFlag = !1, this._onGpsUpdate = new V
        }
        get current() {
          return this._currentGeoLocation
        }
        get onGpsUpdate() {
          return this._onGpsUpdate.event
        }
      }
      const yt = function (l) {
          function t() {}

          function i(f, w) {
            if (f = f === void 0 ? "utf-8" : f, w = w === void 0 ? {
                fatal: !1
              } : w, d.indexOf(f.toLowerCase()) === -1) throw new RangeError("Failed to construct 'TextDecoder': The encoding label provided ('" + f + "') is invalid.");
            if (w.fatal) throw Error("Failed to construct 'TextDecoder': the 'fatal' option is unsupported.")
          }

          function r(f) {
            return Buffer.from(f.buffer, f.byteOffset, f.byteLength).toString("utf-8")
          }

          function n(f) {
            var w = URL.createObjectURL(new Blob([f], {
              type: "text/plain;charset=UTF-8"
            }));
            try {
              var y = new XMLHttpRequest;
              return y.open("GET", w, !1), y.send(), y.responseText
            } catch {
              return c(f)
            } finally {
              URL.revokeObjectURL(w)
            }
          }

          function c(f) {
            for (var w = 0, y = Math.min(65536, f.length + 1), x = new Uint16Array(y), S = [], R = 0;;) {
              var A = w < f.length;
              if (!A || R >= y - 1) {
                if (S.push(String.fromCharCode.apply(null, x.subarray(0, R))), !A) return S.join("");
                f = f.subarray(w), R = w = 0
              }
              if (A = f[w++], (A & 128) === 0) x[R++] = A;
              else if ((A & 224) === 192) {
                var P = f[w++] & 63;
                x[R++] = (A & 31) << 6 | P
              } else if ((A & 240) === 224) {
                P = f[w++] & 63;
                var z = f[w++] & 63;
                x[R++] = (A & 31) << 12 | P << 6 | z
              } else if ((A & 248) === 240) {
                P = f[w++] & 63, z = f[w++] & 63;
                var U = f[w++] & 63;
                A = (A & 7) << 18 | P << 12 | z << 6 | U, 65535 < A && (A -= 65536, x[R++] = A >>> 10 & 1023 | 55296, A = 56320 | A & 1023), x[R++] = A
              }
            }
          }
          if (l.TextEncoder && l.TextDecoder) return !1;
          var d = ["utf-8", "utf8", "unicode-1-1-utf-8"];
          Object.defineProperty(t.prototype, "encoding", {
            value: "utf-8"
          }), t.prototype.encode = function (f, w) {
            if (w = w === void 0 ? {
                stream: !1
              } : w, w.stream) throw Error("Failed to encode: the 'stream' option is unsupported.");
            w = 0;
            for (var y = f.length, x = 0, S = Math.max(32, y + (y >>> 1) + 7), R = new Uint8Array(S >>> 3 << 3); w < y;) {
              var A = f.charCodeAt(w++);
              if (55296 <= A && 56319 >= A) {
                if (w < y) {
                  var P = f.charCodeAt(w);
                  (P & 64512) === 56320 && (++w, A = ((A & 1023) << 10) + (P & 1023) + 65536)
                }
                if (55296 <= A && 56319 >= A) continue
              }
              if (x + 4 > R.length && (S += 8, S *= 1 + w / f.length * 2, S = S >>> 3 << 3, P = new Uint8Array(S), P.set(R), R = P), (A & 4294967168) === 0) R[x++] = A;
              else {
                if ((A & 4294965248) === 0) R[x++] = A >>> 6 & 31 | 192;
                else if ((A & 4294901760) === 0) R[x++] = A >>> 12 & 15 | 224, R[x++] = A >>> 6 & 63 | 128;
                else if ((A & 4292870144) === 0) R[x++] = A >>> 18 & 7 | 240, R[x++] = A >>> 12 & 63 | 128, R[x++] = A >>> 6 & 63 | 128;
                else continue;
                R[x++] = A & 63 | 128
              }
            }
            return R.slice ? R.slice(0, x) : R.subarray(0, x)
          }, Object.defineProperty(i.prototype, "encoding", {
            value: "utf-8"
          }), Object.defineProperty(i.prototype, "fatal", {
            value: !1
          }), Object.defineProperty(i.prototype, "ignoreBOM", {
            value: !1
          });
          var m = c;
          return typeof Buffer == "function" && Buffer.from ? m = r : typeof Blob == "function" && typeof URL == "function" && typeof URL.createObjectURL == "function" && (m = n), i.prototype.decode = function (f, w) {
            if (w = w === void 0 ? {
                stream: !1
              } : w, w.stream) throw Error("Failed to decode: the 'stream' option is unsupported.");
            return f = f instanceof Uint8Array ? f : f.buffer instanceof ArrayBuffer ? new Uint8Array(f.buffer) : new Uint8Array(f), m(f)
          }, l.TextEncoder = t, l.TextDecoder = i, l
        }(typeof window < "u" ? window : typeof Oi < "u" ? Oi : globalThis),
        st = class {
          static log(...l) {
            !st.flag || st.platform == k.Wechat && console.log(...l)
          }
        };
      let et = st;
      et.flag = !1, et.platform = null;
      class Rt {
        static clamp01(t) {
          let i = t;
          return i > 1 ? 1 : i < 0 ? 0 : i
        }
        static clamp(t, i, r) {
          return t < i ? i : t > r ? r : t
        }
      }
      const Vt = class {
        get normalized() {
          return Vt.createByVec(this).normalize()
        }
        constructor(l, t, i) {
          this.x = l || 0, this.y = t || 0, this.z = i || 0
        }
        normalize() {
          let l = this.magnitude();
          return l > Vt.kEpsilon ? this.div(l) : (this.x = 0, this.y = 0, this.z = 0), this
        }
        set(l, t, i) {
          return this.x = l, this.y = t, this.z = i, this
        }
        setByArray(l) {
          return this.x = l[0], this.y = l[1], this.z = l[2], this
        }
        setByVec(l) {
          return this.x = l.x, this.y = l.y, this.z = l.z, this
        }
        clone() {
          return new Vt(this.x, this.y, this.z)
        }
        scale(l) {
          return this.x *= l, this.y *= l, this.z *= l, this
        }
        add(l) {
          return this.x += l.x, this.y += l.y, this.z += l.z, this
        }
        sub(l) {
          return this.x -= l.x, this.y -= l.y, this.z -= l.z, this
        }
        div(l) {
          return this.x = this.x / l, this.y = this.y / l, this.z = this.z / l, this
        }
        sqrMagnitude() {
          return this.x * this.x + this.y * this.y + this.z * this.z
        }
        magnitude() {
          return Math.sqrt(this.sqrMagnitude())
        }
        equals(l) {
          return this.x === l.x && this.y === l.y && this.z === l.z
        }
        static create(l, t, i) {
          return new Vt().set(l, t, i)
        }
        static createByArray(l) {
          return new Vt().setByArray(l)
        }
        static createByVec(l) {
          return new Vt().setByVec(l)
        }
        static sub(l, t) {
          return new Vt(l.x - t.x, l.y - t.y, l.z - t.z)
        }
        static subNum(l, t) {
          return new Vt(l.x - t, l.y - t, l.z - t)
        }
        static add(l, t) {
          return new Vt(l.x + t.x, l.y + t.y, l.z + t.z)
        }
        static addNum(l, t) {
          return new Vt(l.x + t, l.y + t, l.z + t)
        }
        static scale(l, t) {
          return this.create(l.x * t, l.y * t, l.z * t)
        }
        static div(l, t) {
          return this.createByVec(l).div(t)
        }
        static sqrMagnitude(l) {
          return l.x * l.x + l.y * l.y + l.z * l.z
        }
        static magnitude(l) {
          return Math.sqrt(this.sqrMagnitude(l))
        }
        static cross(l, t) {
          return this.create(l.y * t.z - l.z * t.y, l.z * t.x - l.x * t.z, l.x * t.y - l.y * t.x)
        }
        static dot(l, t) {
          return l.x * t.x + l.y * t.y + l.z * t.z
        }
        static angle(l, t) {
          let i = this.dot(l, t) / (this.magnitude(l) * this.magnitude(t));
          return Math.acos(i) * 180 / Math.PI
        }
        static clone(l) {
          return this.create(l.x, l.y, l.z)
        }
        static distanceSq(l, t) {
          let i = l.x - t.x,
            r = l.y - t.y,
            n = l.z - t.z;
          return i * i + r * r + n * n
        }
        static distance(l, t) {
          return Math.sqrt(this.distanceSq(l, t))
        }
        static lerp(l, t, i) {
          return i = Rt.clamp01(i), this.create(l.x + (t.x - l.x) * i, l.y + (t.y - l.y) * i, l.z + (t.z - l.z) * i)
        }
        static lerpUnclamped(l, t, i) {
          return this.create(l.x + (t.x - l.x) * i, l.y + (t.y - l.y) * i, l.z + (t.z - l.z) * i)
        }
        static toString(l) {
          return `{ x: ${l.x}, y: ${l.y}, z: ${l.z}}`
        }
      };
      let Et = Vt;
      Et.kEpsilon = 1e-5, Et.kEpsilonNormalSqrt = 1e-15, Et.zero = {
        x: 0,
        y: 0,
        z: 0
      }, Et.one = {
        x: 1,
        y: 1,
        z: 1
      }, Et.half = {
        x: .5,
        y: .5,
        z: .5
      }, Et.up = {
        x: 0,
        y: 1,
        z: 0
      }, Et.down = {
        x: 0,
        y: -1,
        z: 0
      }, Et.left = {
        x: -1,
        y: 0,
        z: 0
      }, Et.right = {
        x: 1,
        y: 0,
        z: 0
      }, Et.forward = {
        x: 0,
        y: 0,
        z: 1
      }, Et.backward = {
        x: 0,
        y: 0,
        z: -1
      };
      class qt {
        constructor() {
          this.y180Array = [0, 1, 0, 0], this.x = 0, this.y = 0, this.z = 0, this.w = 0
        }
        set(t, i, r, n) {
          this.x = t, this.y = i, this.z = r, this.w = n
        }
        multiply(t) {
          return this.multiplyQuaternions(this, t)
        }
        multiplyQuaternions(t, i) {
          const r = t.x,
            n = t.y,
            c = t.z,
            d = t.w,
            m = i.x,
            f = i.y,
            w = i.z,
            y = i.w;
          return this.x = r * y + d * m + n * w - c * f, this.y = n * y + d * f + c * m - r * w, this.z = c * y + d * w + r * f - n * m, this.w = d * y - r * m - n * f - c * w, this
        }
        setFromMat4(t) {
          let i = this,
            r, n, c, d, m, f, w, y, x, S, R, A, P, z, U;
          return r = t.data[0], n = t.data[1], c = t.data[2], d = t.data[4], m = t.data[5], f = t.data[6], w = t.data[8], y = t.data[9], x = t.data[10], P = r * r + n * n + c * c, P === 0 || (P = 1 / Math.sqrt(P), z = d * d + m * m + f * f, z === 0) || (z = 1 / Math.sqrt(z), U = w * w + y * y + x * x, U === 0) || (U = 1 / Math.sqrt(U), r *= P, n *= P, c *= P, d *= z, m *= z, f *= z, w *= U, y *= U, x *= U, S = r + m + x, S >= 0 ? (R = Math.sqrt(S + 1), i.w = R * .5, R = .5 / R, i.x = (f - y) * R, i.y = (w - c) * R, i.z = (n - d) * R) : r > m ? r > x ? (A = r - (m + x) + 1, A = Math.sqrt(A), i.x = A * .5, A = .5 / A, i.w = (f - y) * A, i.y = (n + d) * A, i.z = (c + w) * A) : (A = x - (r + m) + 1, A = Math.sqrt(A), i.z = A * .5, A = .5 / A, i.w = (n - d) * A, i.x = (w + c) * A, i.y = (y + f) * A) : m > x ? (A = m - (x + r) + 1, A = Math.sqrt(A), i.y = A * .5, A = .5 / A, i.w = (w - c) * A, i.z = (f + y) * A, i.x = (d + n) * A) : (A = x - (r + m) + 1, A = Math.sqrt(A), i.z = A * .5, A = .5 / A, i.w = (n - d) * A, i.x = (w + c) * A, i.y = (y + f) * A)), i
        }
        slerp(t, i, r) {
          const n = t.x,
            c = t.y,
            d = t.z,
            m = t.w;
          let f = i.x,
            w = i.y,
            y = i.z,
            x = i.w,
            S = m * x + n * f + c * w + d * y;
          if (S < 0 && (x = -x, f = -f, w = -w, y = -y, S = -S), Math.abs(S) >= 1) return this.w = m, this.x = n, this.y = c, this.z = d, this;
          const R = Math.acos(S),
            A = Math.sqrt(1 - S * S);
          if (Math.abs(A) < .001) return this.w = m * .5 + x * .5, this.x = n * .5 + f * .5, this.y = c * .5 + w * .5, this.z = d * .5 + y * .5, this;
          const P = Math.sin((1 - r) * R) / A,
            z = Math.sin(r * R) / A;
          return this.w = m * P + x * z, this.x = n * P + f * z, this.y = c * P + w * z, this.z = d * P + y * z, this
        }
      }
      qt.identity = {
        x: 0,
        y: 0,
        z: 0,
        w: 1
      };
      class kt {
        constructor() {
          this.data = null;
          let t = new Float32Array(16);
          t[0] = t[5] = t[10] = t[15] = 1, this.data = t
        }
        get array() {
          return this.data ? Array.from(this.data) : null
        }
        set(t) {
          for (let i = 0; i < t.length; i++) this.data[i] = t[i];
          return this
        }
        clone() {
          let t = new kt;
          return t.set(this.data), t
        }
        setTRS(t, i, r) {
          var n, c, d, m, f, w, y, x, S, R, A, P, z, U, Y, mt, gt, dt, ot, ht, $, ft, ut;
          return n = t.x, c = t.y, d = t.z, m = i.x, f = i.y, w = i.z, y = i.w, x = r.x, S = r.y, R = r.z, A = m + m, P = f + f, z = w + w, U = m * A, Y = m * P, mt = m * z, gt = f * P, dt = f * z, ot = w * z, ht = y * A, $ = y * P, ft = y * z, ut = this.data, ut[0] = (1 - (gt + ot)) * x, ut[1] = (Y + ft) * x, ut[2] = (mt - $) * x, ut[3] = 0, ut[4] = (Y - ft) * S, ut[5] = (1 - (U + ot)) * S, ut[6] = (dt + ht) * S, ut[7] = 0, ut[8] = (mt + $) * R, ut[9] = (dt - ht) * R, ut[10] = (1 - (U + gt)) * R, ut[11] = 0, ut[12] = n, ut[13] = c, ut[14] = d, ut[15] = 1, this
        }
        transpose() {
          let t = this.data,
            i;
          return i = t[1], t[1] = t[4], t[4] = i, i = t[2], t[2] = t[8], t[8] = i, i = t[6], t[6] = t[9], t[9] = i, i = t[3], t[3] = t[12], t[12] = i, i = t[7], t[7] = t[13], t[13] = i, i = t[11], t[11] = t[14], t[14] = i, this
        }
        getInverse() {
          let t = this.data,
            i = [],
            r = t[0],
            n = t[1],
            c = t[2],
            d = t[3],
            m = t[4],
            f = t[5],
            w = t[6],
            y = t[7],
            x = t[8],
            S = t[9],
            R = t[10],
            A = t[11],
            P = t[12],
            z = t[13],
            U = t[14],
            Y = t[15],
            mt = S * U * y - z * R * y + z * w * A - f * U * A - S * w * Y + f * R * Y,
            gt = P * R * y - x * U * y - P * w * A + m * U * A + x * w * Y - m * R * Y,
            dt = x * z * y - P * S * y + P * f * A - m * z * A - x * f * Y + m * S * Y,
            ot = P * S * w - x * z * w - P * f * R + m * z * R + x * f * U - m * S * U,
            ht = r * mt + n * gt + c * dt + d * ot;
          if (ht <= Number.EPSILON) throw new Error("error!");
          let $ = 1 / ht;
          return i[0] = mt * $, i[1] = (z * R * d - S * U * d - z * c * A + n * U * A + S * c * Y - n * R * Y) * $, i[2] = (f * U * d - z * w * d + z * c * y - n * U * y - f * c * Y + n * w * Y) * $, i[3] = (S * w * d - f * R * d - S * c * y + n * R * y + f * c * A - n * w * A) * $, i[4] = gt * $, i[5] = (x * U * d - P * R * d + P * c * A - r * U * A - x * c * Y + r * R * Y) * $, i[6] = (P * w * d - m * U * d - P * c * y + r * U * y + m * c * Y - r * w * Y) * $, i[7] = (m * R * d - x * w * d + x * c * y - r * R * y - m * c * A + r * w * A) * $, i[8] = dt * $, i[9] = (P * S * d - x * z * d - P * n * A + r * z * A + x * n * Y - r * S * Y) * $, i[10] = (m * z * d - P * f * d + P * n * y - r * z * y - m * n * Y + r * f * Y) * $, i[11] = (x * f * d - m * S * d - x * n * y + r * S * y + m * n * A - r * f * A) * $, i[12] = ot * $, i[13] = (x * z * c - P * S * c + P * n * R - r * z * R - x * n * U + r * S * U) * $, i[14] = (P * f * c - m * z * c - P * n * w + r * z * w + m * n * U - r * f * U) * $, i[15] = (m * S * c - x * f * c + x * n * w - r * S * w - m * n * R + r * f * R) * $, this.data.set(i), this
        }
        determinant() {
          const t = this.data,
            i = t[0],
            r = t[4],
            n = t[8],
            c = t[12],
            d = t[1],
            m = t[5],
            f = t[9],
            w = t[13],
            y = t[2],
            x = t[6],
            S = t[10],
            R = t[14],
            A = t[3],
            P = t[7],
            z = t[11],
            U = t[15];
          return A * (+c * f * x - n * w * x - c * m * S + r * w * S + n * m * R - r * f * R) + P * (+i * f * R - i * w * S + c * d * S - n * d * R + n * w * y - c * f * y) + z * (+i * w * x - i * m * R - c * d * x + r * d * R + c * m * y - r * w * y) + U * (-n * m * y - i * f * x + i * m * S + n * d * x - r * d * S + r * f * y)
        }
        decompose() {
          const t = this.data;
          let i = new Et(t[0], t[1], t[2]).magnitude(),
            r = new Et(t[4], t[5], t[6]).magnitude(),
            n = new Et(t[8], t[9], t[10]).magnitude();
          this.determinant() < 0 && (i = -i);
          let c = new Et(t[12], t[13], t[14]),
            d = new kt;
          d.set(this.data);
          const m = 1 / i,
            f = 1 / r,
            w = 1 / n;
          d.data[0] *= m, d.data[1] *= m, d.data[2] *= m, d.data[4] *= f, d.data[5] *= f, d.data[6] *= f, d.data[8] *= w, d.data[9] *= w, d.data[10] *= w;
          let y = new Et(i, r, n);
          return y.x = i, y.y = r, y.z = n, {
            position: c,
            rotation: d,
            scale: y
          }
        }
        mul2(t, i) {
          const r = t.data,
            n = i.data,
            c = this.data,
            d = r[0],
            m = r[4],
            f = r[8],
            w = r[12],
            y = r[1],
            x = r[5],
            S = r[9],
            R = r[13],
            A = r[2],
            P = r[6],
            z = r[10],
            U = r[14],
            Y = r[3],
            mt = r[7],
            gt = r[11],
            dt = r[15],
            ot = n[0],
            ht = n[4],
            $ = n[8],
            ft = n[12],
            ut = n[1],
            At = n[5],
            jt = n[9],
            Nt = n[13],
            Ot = n[2],
            ue = n[6],
            de = n[10],
            ae = n[14],
            pe = n[3],
            me = n[7],
            re = n[11],
            ne = n[15];
          return c[0] = d * ot + m * ut + f * Ot + w * pe, c[4] = d * ht + m * At + f * ue + w * me, c[8] = d * $ + m * jt + f * de + w * re, c[12] = d * ft + m * Nt + f * ae + w * ne, c[1] = y * ot + x * ut + S * Ot + R * pe, c[5] = y * ht + x * At + S * ue + R * me, c[9] = y * $ + x * jt + S * de + R * re, c[13] = y * ft + x * Nt + S * ae + R * ne, c[2] = A * ot + P * ut + z * Ot + U * pe, c[6] = A * ht + P * At + z * ue + U * me, c[10] = A * $ + P * jt + z * de + U * re, c[14] = A * ft + P * Nt + z * ae + U * ne, c[3] = Y * ot + mt * ut + gt * Ot + dt * pe, c[7] = Y * ht + mt * At + gt * ue + dt * me, c[11] = Y * $ + mt * jt + gt * de + dt * re, c[15] = Y * ft + mt * Nt + gt * ae + dt * ne, this
        }
        mul(t) {
          return this.mul2(this, t)
        }
        getPosition() {
          return new Et(this.data[12], this.data[13], this.data[14])
        }
        getRotationEulerAngles() {
          let t = 0,
            i = 0,
            r = 0;
          if (Math.abs(this.data[2] - 1) > Number.EPSILON && Math.abs(this.data[2] + 1) > Number.EPSILON) {
            i = -Math.asin(this.data[2]);
            const n = Math.cos(i);
            t = Math.atan2(this.data[6] / n, this.data[10] / n), r = Math.atan2(this.data[1] / n, this.data[0] / n)
          } else Math.abs(this.data[2] + 1) <= Number.EPSILON ? (i = Math.PI / 2, t = Math.atan2(this.data[4], this.data[8])) : (i = -Math.PI / 2, t = Math.atan2(-this.data[4], -this.data[8]));
          return new Et(t, i, r)
        }
        setFromEulerAngles(t, i, r) {
          const n = Math.PI / 180;
          t *= n, i *= n, r *= n;
          const c = Math.sin(-t),
            d = Math.cos(-t),
            m = Math.sin(-i),
            f = Math.cos(-i),
            w = Math.sin(-r),
            y = Math.cos(-r),
            x = this.data;
          return x[0] = f * y, x[1] = -f * w, x[2] = m, x[3] = 0, x[4] = d * w + y * c * m, x[5] = d * y - c * m * w, x[6] = -f * c, x[7] = 0, x[8] = c * w - d * y * m, x[9] = y * c + d * m * w, x[10] = d * f, x[11] = 0, x[12] = 0, x[13] = 0, x[14] = 0, x[15] = 1, this
        }
        setFromEulerAnglesRad(t, i, r) {
          const n = Math.sin(-t),
            c = Math.cos(-t),
            d = Math.sin(-i),
            m = Math.cos(-i),
            f = Math.sin(-r),
            w = Math.cos(-r),
            y = this.data;
          return y[0] = m * w, y[1] = -m * f, y[2] = d, y[3] = 0, y[4] = c * f + w * n * d, y[5] = c * w - n * d * f, y[6] = -m * n, y[7] = 0, y[8] = n * f - c * w * d, y[9] = w * n + c * d * f, y[10] = c * m, y[11] = 0, y[12] = 0, y[13] = 0, y[14] = 0, y[15] = 1, this
        }
      }
      var ye = (l => (l[l.NotTracking = 0] = "NotTracking", l[l.Limited = 1] = "Limited", l[l.Tracking = 2] = "Tracking", l))(ye || {}),
        _t = (l => (l[l.ZeroDof = 0] = "ZeroDof", l[l.ThreeDofRotOnly = 1] = "ThreeDofRotOnly", l[l.SixDof = 2] = "SixDof", l))(_t || {});
      const We = 4 / 3;

      function Ke(l, t, i) {
        return l / t > i - .003 ? l : t * i
      }

      function si(l) {
        const t = Ke(.8, .6, We) / Ke(l.width, l.height, We),
          i = l.fx * t,
          r = l.fy * t,
          n = l.cx * .8 / l.width,
          c = l.cy * .6 / l.height;
        return {
          width: .8,
          height: .6,
          fx: i,
          fy: r,
          cx: n,
          cy: c
        }
      }
      class Xt {
        constructor(t, i, r, n, c, d, m) {
          this._cameraOrientation = 90, this._deviceRotation = 0, this._width = t, this._height = i, this._fx = r, this._fy = n, this._cx = c, this._cy = d, this._deviceRotation = m
        }
        get width() {
          return this._width
        }
        get height() {
          return this._height
        }
        get fx() {
          return this._fx
        }
        get fy() {
          return this._fy
        }
        get cx() {
          return this._cx
        }
        get cy() {
          return this._cy
        }
        get cameraOrientation() {
          return this._cameraOrientation
        }
        set cameraOrientation(t) {
          this._cameraOrientation = t
        }
        static createFromCalibData(t, i, r, n) {
          if (!t) throw new Error("Try to create camera params from null calib data");
          const c = si(t),
            d = Ke(r, n, We) / Ke(c.width, c.height, We),
            m = c.fx * d,
            f = c.fy * d,
            w = c.cx * r / c.width,
            y = c.cy * n / c.height;
          return new Xt(r, n, m, f, w, y, i)
        }
        static createDefault(t, i, r, n) {
          return new Xt(t, i, r * .85, r * .85, t / 2, i / 2, n)
        }
        getProjectionMatrix(t, i) {
          let r = new kt;
          return r.data[0] = 2 * this._fx / this._width, r.data[1] = 0, r.data[2] = 0, r.data[3] = 0, r.data[4] = 0, r.data[5] = 2 * this._fy / this._height, r.data[6] = 0, r.data[7] = 0, r.data[8] = 1 - 2 * this._cx / this._width, r.data[9] = -1 + 2 * this._cy / this._height, r.data[10] = -(t + i) / (t - i), r.data[11] = -1, r.data[12] = 0, r.data[13] = 0, r.data[14] = -2 * t * i / (t - i), r.data[15] = 0, r
        }
        getImageOrientation() {
          return (this._cameraOrientation + (360 - this._deviceRotation)) % 360
        }
        getParamString() {
          return "[" + this._fx + "," + this._fy + "," + this._cx + "," + this._cy + "]"
        }
        getSize() {
          return [`${this._width}`, `${this._height}`]
        }
        getParam() {
          return [`${this._fx}`, `${this._fy}`, `${this._cx}`, `${this._cy}`]
        }
      }
      var Bt = (l => (l[l.UnknownError = 0] = "UnknownError", l[l.Found = 1] = "Found", l[l.NotFound = 2] = "NotFound", l[l.RequestTimeout = 3] = "RequestTimeout", l[l.RequestIntervalTooLow = 4] = "RequestIntervalTooLow", l[l.QpsLimitExceeded = 5] = "QpsLimitExceeded", l[l.WakingUp = 6] = "WakingUp", l))(Bt || {});
      class b {
        constructor(t, i, r, n) {
          this.acce = t, this.geoLocation = i, this.proximity = r, this.blockIds = n
        }
      }
      class J {
        constructor(t, i, r) {
          this._blockId = "", this._name = "", this._pose = null, this._blockId = t, this._name = i, this._pose = r
        }
        get blockId() {
          return this._blockId
        }
        get name() {
          return this._name
        }
        get pose() {
          return this._pose
        }
        static fromBlockLocalizationResult(t) {
          return new J(t.mapId, t.name, new kt().set(t.pose).transpose())
        }
        static fromLandmarkLocalizationResult(t) {
          return new J(t.blockId, t.name, new kt().set(t.pose).transpose())
        }
      }

      function pt(l, t, i, r, n, c) {
        if (l == _t.ZeroDof) return null;
        if (!r) return et.log("Null input frame camera transform matrix in mode: ", _t[l]), null;
        const d = r.clone().decompose(),
          m = d.position,
          f = new qt().setFromMat4(d.rotation);
        return `${t},${i},${m.x},${m.y},${m.z},${f.x},${f.y},${f.z},${f.w},${n.x},${n.y},${n.z},${c}`
      }

      function St(l, t, i) {
        if (l == _t.ZeroDof) return null;
        if (!i) return et.log("Null input frame camera transform matrix in mode: ", _t[l]), null;
        const r = i.clone().decompose(),
          n = r.position,
          c = new qt().setFromMat4(r.rotation);
        return `${t},${n.x},${n.y},${n.z},${c.x},${c.y},${c.z},${c.w}`
      }
      const Wt = "requestArgs",
        Qt = "clsResponse",
        Pe = "nativePoses",
        Fe = class {
          constructor() {
            this._totalRecord = {}, this._recordingDataFlag = !1, this._platform = null, this._totalRecord[Wt] = [], this._totalRecord[Qt] = [], this._totalRecord[Pe] = []
          }
          get isRecordingData() {
            return this._recordingDataFlag
          }
          set isRecordingData(l) {
            this._recordingDataFlag = l
          }
          get platform() {
            return this._platform
          }
          set platform(l) {
            this._platform = l
          }
          static getInstance() {
            return Fe.instance || (Fe.instance = new Fe), Fe.instance
          }
          makeDateString() {
            let l = new Date,
              t = l.getFullYear() - 2e3,
              i = l.getMonth() + 1 >= 10 ? l.getMonth() + 1 : "0" + (l.getMonth() + 1),
              r = l.getDate() >= 10 ? l.getDate() : "0" + l.getDate(),
              n = l.getHours() >= 10 ? l.getHours() : "0" + l.getHours(),
              c = l.getMinutes() >= 10 ? l.getMinutes() : "0" + l.getMinutes(),
              d = l.getSeconds() >= 10 ? l.getSeconds() : "0" + l.getSeconds();
            return `${t}-${i}-${r}_${n}-${c}-${d}`
          }
          clear() {
            this._totalRecord = {}, this._totalRecord[Wt] = [], this._totalRecord[Qt] = [], this._totalRecord[Pe] = []
          }
          recordRequestArgs(l) {
            this._totalRecord[Wt].push(l)
          }
          recordClsResponse(l) {
            this._totalRecord[Qt].push(l)
          }
          recordNativePose(l) {
            this._totalRecord[Pe].push(l)
          }
          preserveRequest() {
            let l = null,
              t = null;
            return this._platform ? (this._platform == k.Wechat && (l = `EasyAR_WX_${this.makeDateString()}.json`, t = `${wx.env.USER_DATA_PATH}/${l}`, wx.getFileSystemManager().writeFileSync(t, JSON.stringify(this._totalRecord), "utf8"), this.clear()), t) : null
          }
        };
      let bt = Fe;
      bt.instance = null;
      for (var we = [], ie = [], or = typeof Uint8Array < "u" ? Uint8Array : Array, Zi = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", Ye = 0, hr = Zi.length; Ye < hr; ++Ye) we[Ye] = Zi[Ye], ie[Zi.charCodeAt(Ye)] = Ye;
      ie["-".charCodeAt(0)] = 62, ie["_".charCodeAt(0)] = 63;

      function lr(l) {
        var t = l.length;
        if (t % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
        var i = l.indexOf("=");
        i === -1 && (i = t);
        var r = i === t ? 0 : 4 - i % 4;
        return [i, r]
      }

      function cr(l, t, i) {
        return (t + i) * 3 / 4 - i
      }

      function ur(l) {
        var t, i = lr(l),
          r = i[0],
          n = i[1],
          c = new or(cr(l, r, n)),
          d = 0,
          m = n > 0 ? r - 4 : r,
          f;
        for (f = 0; f < m; f += 4) t = ie[l.charCodeAt(f)] << 18 | ie[l.charCodeAt(f + 1)] << 12 | ie[l.charCodeAt(f + 2)] << 6 | ie[l.charCodeAt(f + 3)], c[d++] = t >> 16 & 255, c[d++] = t >> 8 & 255, c[d++] = t & 255;
        return n === 2 && (t = ie[l.charCodeAt(f)] << 2 | ie[l.charCodeAt(f + 1)] >> 4, c[d++] = t & 255), n === 1 && (t = ie[l.charCodeAt(f)] << 10 | ie[l.charCodeAt(f + 1)] << 4 | ie[l.charCodeAt(f + 2)] >> 2, c[d++] = t >> 8 & 255, c[d++] = t & 255), c
      }

      function dr(l) {
        return we[l >> 18 & 63] + we[l >> 12 & 63] + we[l >> 6 & 63] + we[l & 63]
      }

      function pr(l, t, i) {
        for (var r, n = [], c = t; c < i; c += 3) r = (l[c] << 16 & 16711680) + (l[c + 1] << 8 & 65280) + (l[c + 2] & 255), n.push(dr(r));
        return n.join("")
      }

      function mr(l) {
        for (var t, i = l.length, r = i % 3, n = [], c = 16383, d = 0, m = i - r; d < m; d += c) n.push(pr(l, d, d + c > m ? m : d + c));
        return r === 1 ? (t = l[i - 1], n.push(we[t >> 2] + we[t << 4 & 63] + "==")) : r === 2 && (t = (l[i - 2] << 8) + l[i - 1], n.push(we[t >> 10] + we[t >> 4 & 63] + we[t << 2 & 63] + "=")), n.join("")
      }
      const ts = function () {
        var l = {},
          t = function (r, n, c) {
            var d = {
              exports: {},
              _tempexports: {}
            };
            l[r] = {
              status: 0,
              func: n,
              req: c,
              m: d
            }
          },
          i = function (r, n) {
            if (!l[r]) return ir(n);
            if (!l[r].status) {
              var c = l[r].m;
              c._exports = c._tempexports;
              var d = Object.getOwnPropertyDescriptor(c, "exports");
              d && d.configurable && Object.defineProperty(c, "exports", {
                set: function (m) {
                  typeof m == "object" && m !== c._exports && (c._exports.__proto__ = m.__proto__, Object.keys(m).forEach(function (f) {
                    c._exports[f] = m[f]
                  })), c._tempexports = m
                },
                get: function () {
                  return c._tempexports
                }
              }), l[r].status = 1, l[r].func(l[r].req, c, c.exports)
            }
            return l[r].m.exports
          };
        return t(1658745339199, function (r, n, c) {
          (function (d, m) {
            typeof c == "object" && typeof n < "u" ? n.exports = m() : (d = typeof globalThis < "u" ? globalThis : d || self).jsSHA = m()
          })(this, function () {
            var d = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

            function m(I, v, T, C) {
              var F, M, N, q = v || [0],
                j = (T = T || 0) >>> 3,
                X = C === -1 ? 3 : 0;
              for (F = 0; F < I.length; F += 1) M = (N = F + j) >>> 2, q.length <= M && q.push(0), q[M] |= I[F] << 8 * (X + C * (N % 4));
              return {
                value: q,
                binLen: 8 * I.length + T
              }
            }

            function f(I, v, T) {
              switch (v) {
                case "UTF8":
                case "UTF16BE":
                case "UTF16LE":
                  break;
                default:
                  throw new Error("encoding must be UTF8, UTF16BE, or UTF16LE")
              }
              switch (I) {
                case "HEX":
                  return function (C, F, M) {
                    return function (N, q, j, X) {
                      var at, K, Z, wt;
                      if (N.length % 2 != 0) throw new Error("String of HEX type must be in byte increments");
                      var G = q || [0],
                        Tt = (j = j || 0) >>> 3,
                        Mt = X === -1 ? 3 : 0;
                      for (at = 0; at < N.length; at += 2) {
                        if (K = parseInt(N.substr(at, 2), 16), isNaN(K)) throw new Error("String of HEX type contains invalid characters");
                        for (Z = (wt = (at >>> 1) + Tt) >>> 2; G.length <= Z;) G.push(0);
                        G[Z] |= K << 8 * (Mt + X * (wt % 4))
                      }
                      return {
                        value: G,
                        binLen: 4 * N.length + j
                      }
                    }(C, F, M, T)
                  };
                case "TEXT":
                  return function (C, F, M) {
                    return function (N, q, j, X, at) {
                      var K, Z, wt, G, Tt, Mt, It, zt, Te = 0,
                        te = j || [0],
                        _e = (X = X || 0) >>> 3;
                      if (q === "UTF8")
                        for (It = at === -1 ? 3 : 0, wt = 0; wt < N.length; wt += 1)
                          for (Z = [], 128 > (K = N.charCodeAt(wt)) ? Z.push(K) : 2048 > K ? (Z.push(192 | K >>> 6), Z.push(128 | 63 & K)) : 55296 > K || 57344 <= K ? Z.push(224 | K >>> 12, 128 | K >>> 6 & 63, 128 | 63 & K) : (wt += 1, K = 65536 + ((1023 & K) << 10 | 1023 & N.charCodeAt(wt)), Z.push(240 | K >>> 18, 128 | K >>> 12 & 63, 128 | K >>> 6 & 63, 128 | 63 & K)), G = 0; G < Z.length; G += 1) {
                            for (Tt = (Mt = Te + _e) >>> 2; te.length <= Tt;) te.push(0);
                            te[Tt] |= Z[G] << 8 * (It + at * (Mt % 4)), Te += 1
                          } else
                            for (It = at === -1 ? 2 : 0, zt = q === "UTF16LE" && at !== 1 || q !== "UTF16LE" && at === 1, wt = 0; wt < N.length; wt += 1) {
                              for (K = N.charCodeAt(wt), zt === !0 && (K = (G = 255 & K) << 8 | K >>> 8), Tt = (Mt = Te + _e) >>> 2; te.length <= Tt;) te.push(0);
                              te[Tt] |= K << 8 * (It + at * (Mt % 4)), Te += 2
                            }
                      return {
                        value: te,
                        binLen: 8 * Te + X
                      }
                    }(C, v, F, M, T)
                  };
                case "B64":
                  return function (C, F, M) {
                    return function (N, q, j, X) {
                      var at, K, Z, wt, G, Tt, Mt = 0,
                        It = q || [0],
                        zt = (j = j || 0) >>> 3,
                        Te = X === -1 ? 3 : 0,
                        te = N.indexOf("=");
                      if (N.search(/^[a-zA-Z0-9=+/]+$/) === -1) throw new Error("Invalid character in base-64 string");
                      if (N = N.replace(/=/g, ""), te !== -1 && te < N.length) throw new Error("Invalid '=' found in base-64 string");
                      for (at = 0; at < N.length; at += 4) {
                        for (wt = N.substr(at, 4), Z = 0, K = 0; K < wt.length; K += 1) Z |= d.indexOf(wt.charAt(K)) << 18 - 6 * K;
                        for (K = 0; K < wt.length - 1; K += 1) {
                          for (G = (Tt = Mt + zt) >>> 2; It.length <= G;) It.push(0);
                          It[G] |= (Z >>> 16 - 8 * K & 255) << 8 * (Te + X * (Tt % 4)), Mt += 1
                        }
                      }
                      return {
                        value: It,
                        binLen: 8 * Mt + j
                      }
                    }(C, F, M, T)
                  };
                case "BYTES":
                  return function (C, F, M) {
                    return function (N, q, j, X) {
                      var at, K, Z, wt, G = q || [0],
                        Tt = (j = j || 0) >>> 3,
                        Mt = X === -1 ? 3 : 0;
                      for (K = 0; K < N.length; K += 1) at = N.charCodeAt(K), Z = (wt = K + Tt) >>> 2, G.length <= Z && G.push(0), G[Z] |= at << 8 * (Mt + X * (wt % 4));
                      return {
                        value: G,
                        binLen: 8 * N.length + j
                      }
                    }(C, F, M, T)
                  };
                case "ARRAYBUFFER":
                  try {
                    new ArrayBuffer(0)
                  } catch {
                    throw new Error("ARRAYBUFFER not supported by this environment")
                  }
                  return function (C, F, M) {
                    return function (N, q, j, X) {
                      return m(new Uint8Array(N), q, j, X)
                    }(C, F, M, T)
                  };
                case "UINT8ARRAY":
                  try {
                    new Uint8Array(0)
                  } catch {
                    throw new Error("UINT8ARRAY not supported by this environment")
                  }
                  return function (C, F, M) {
                    return m(C, F, M, T)
                  };
                default:
                  throw new Error("format must be HEX, TEXT, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY")
              }
            }

            function w(I, v, T, C) {
              switch (I) {
                case "HEX":
                  return function (F) {
                    return function (M, N, q, j) {
                      var X, at, K = "",
                        Z = N / 8,
                        wt = q === -1 ? 3 : 0;
                      for (X = 0; X < Z; X += 1) at = M[X >>> 2] >>> 8 * (wt + q * (X % 4)), K += "0123456789abcdef".charAt(at >>> 4 & 15) + "0123456789abcdef".charAt(15 & at);
                      return j.outputUpper ? K.toUpperCase() : K
                    }(F, v, T, C)
                  };
                case "B64":
                  return function (F) {
                    return function (M, N, q, j) {
                      var X, at, K, Z, wt, G = "",
                        Tt = N / 8,
                        Mt = q === -1 ? 3 : 0;
                      for (X = 0; X < Tt; X += 3)
                        for (Z = X + 1 < Tt ? M[X + 1 >>> 2] : 0, wt = X + 2 < Tt ? M[X + 2 >>> 2] : 0, K = (M[X >>> 2] >>> 8 * (Mt + q * (X % 4)) & 255) << 16 | (Z >>> 8 * (Mt + q * ((X + 1) % 4)) & 255) << 8 | wt >>> 8 * (Mt + q * ((X + 2) % 4)) & 255, at = 0; at < 4; at += 1) G += 8 * X + 6 * at <= N ? d.charAt(K >>> 6 * (3 - at) & 63) : j.b64Pad;
                      return G
                    }(F, v, T, C)
                  };
                case "BYTES":
                  return function (F) {
                    return function (M, N, q) {
                      var j, X, at = "",
                        K = N / 8,
                        Z = q === -1 ? 3 : 0;
                      for (j = 0; j < K; j += 1) X = M[j >>> 2] >>> 8 * (Z + q * (j % 4)) & 255, at += String.fromCharCode(X);
                      return at
                    }(F, v, T)
                  };
                case "ARRAYBUFFER":
                  try {
                    new ArrayBuffer(0)
                  } catch {
                    throw new Error("ARRAYBUFFER not supported by this environment")
                  }
                  return function (F) {
                    return function (M, N, q) {
                      var j, X = N / 8,
                        at = new ArrayBuffer(X),
                        K = new Uint8Array(at),
                        Z = q === -1 ? 3 : 0;
                      for (j = 0; j < X; j += 1) K[j] = M[j >>> 2] >>> 8 * (Z + q * (j % 4)) & 255;
                      return at
                    }(F, v, T)
                  };
                case "UINT8ARRAY":
                  try {
                    new Uint8Array(0)
                  } catch {
                    throw new Error("UINT8ARRAY not supported by this environment")
                  }
                  return function (F) {
                    return function (M, N, q) {
                      var j, X = N / 8,
                        at = q === -1 ? 3 : 0,
                        K = new Uint8Array(X);
                      for (j = 0; j < X; j += 1) K[j] = M[j >>> 2] >>> 8 * (at + q * (j % 4)) & 255;
                      return K
                    }(F, v, T)
                  };
                default:
                  throw new Error("format must be HEX, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY")
              }
            }
            var y = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298],
              x = [3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428],
              S = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225],
              R = "Chosen SHA variant is not supported";

            function A(I, v) {
              var T, C, F = I.binLen >>> 3,
                M = v.binLen >>> 3,
                N = F << 3,
                q = 4 - F << 3;
              if (F % 4 != 0) {
                for (T = 0; T < M; T += 4) C = F + T >>> 2, I.value[C] |= v.value[T >>> 2] << N, I.value.push(0), I.value[C + 1] |= v.value[T >>> 2] >>> q;
                return (I.value.length << 2) - 4 >= M + F && I.value.pop(), {
                  value: I.value,
                  binLen: I.binLen + v.binLen
                }
              }
              return {
                value: I.value.concat(v.value),
                binLen: I.binLen + v.binLen
              }
            }

            function P(I) {
              var v = {
                  outputUpper: !1,
                  b64Pad: "=",
                  outputLen: -1
                },
                T = I || {},
                C = "Output length must be a multiple of 8";
              if (v.outputUpper = T.outputUpper || !1, T.b64Pad && (v.b64Pad = T.b64Pad), T.outputLen) {
                if (T.outputLen % 8 != 0) throw new Error(C);
                v.outputLen = T.outputLen
              } else if (T.shakeLen) {
                if (T.shakeLen % 8 != 0) throw new Error(C);
                v.outputLen = T.shakeLen
              }
              if (typeof v.outputUpper != "boolean") throw new Error("Invalid outputUpper formatting option");
              if (typeof v.b64Pad != "string") throw new Error("Invalid b64Pad formatting option");
              return v
            }

            function z(I, v, T, C) {
              var F = I + " must include a value and format";
              if (!v) {
                if (!C) throw new Error(F);
                return C
              }
              if (v.value === void 0 || !v.format) throw new Error(F);
              return f(v.format, v.encoding || "UTF8", T)(v.value)
            }
            var U = function () {
                function I(v, T, C) {
                  var F = C || {};
                  if (this.t = T, this.i = F.encoding || "UTF8", this.numRounds = F.numRounds || 1, isNaN(this.numRounds) || this.numRounds !== parseInt(this.numRounds, 10) || 1 > this.numRounds) throw new Error("numRounds must a integer >= 1");
                  this.o = v, this.u = [], this.s = 0, this.h = !1, this.v = 0, this.A = !1, this.l = [], this.H = []
                }
                return I.prototype.update = function (v) {
                  var T, C = 0,
                    F = this.S >>> 5,
                    M = this.p(v, this.u, this.s),
                    N = M.binLen,
                    q = M.value,
                    j = N >>> 5;
                  for (T = 0; T < j; T += F) C + this.S <= N && (this.m = this.R(q.slice(T, T + F), this.m), C += this.S);
                  this.v += C, this.u = q.slice(C >>> 5), this.s = N % this.S, this.h = !0
                }, I.prototype.getHash = function (v, T) {
                  var C, F, M = this.U,
                    N = P(T);
                  if (this.T) {
                    if (N.outputLen === -1) throw new Error("Output length must be specified in options");
                    M = N.outputLen
                  }
                  var q = w(v, M, this.C, N);
                  if (this.A && this.F) return q(this.F(N));
                  for (F = this.K(this.u.slice(), this.s, this.v, this.B(this.m), M), C = 1; C < this.numRounds; C += 1) this.T && M % 32 != 0 && (F[F.length - 1] &= 16777215 >>> 24 - M % 32), F = this.K(F, M, 0, this.L(this.o), M);
                  return q(F)
                }, I.prototype.setHMACKey = function (v, T, C) {
                  if (!this.g) throw new Error("Variant does not support HMAC");
                  if (this.h) throw new Error("Cannot set MAC key after calling update");
                  var F = f(T, (C || {}).encoding || "UTF8", this.C);
                  this.k(F(v))
                }, I.prototype.k = function (v) {
                  var T, C = this.S >>> 3,
                    F = C / 4 - 1;
                  if (this.numRounds !== 1) throw new Error("Cannot set numRounds with MAC");
                  if (this.A) throw new Error("MAC key already set");
                  for (C < v.binLen / 8 && (v.value = this.K(v.value, v.binLen, 0, this.L(this.o), this.U)); v.value.length <= F;) v.value.push(0);
                  for (T = 0; T <= F; T += 1) this.l[T] = 909522486 ^ v.value[T], this.H[T] = 1549556828 ^ v.value[T];
                  this.m = this.R(this.l, this.m), this.v = this.S, this.A = !0
                }, I.prototype.getHMAC = function (v, T) {
                  var C = P(T);
                  return w(v, this.U, this.C, C)(this.Y())
                }, I.prototype.Y = function () {
                  var v;
                  if (!this.A) throw new Error("Cannot call getHMAC without first setting MAC key");
                  var T = this.K(this.u.slice(), this.s, this.v, this.B(this.m), this.U);
                  return v = this.R(this.H, this.L(this.o)), v = this.K(T, this.U, this.S, v, this.U)
                }, I
              }(),
              Y = function (I, v) {
                return (Y = Object.setPrototypeOf || {
                    __proto__: []
                  }
                  instanceof Array && function (T, C) {
                    T.__proto__ = C
                  } || function (T, C) {
                    for (var F in C) Object.prototype.hasOwnProperty.call(C, F) && (T[F] = C[F])
                  })(I, v)
              };

            function mt(I, v) {
              function T() {
                this.constructor = I
              }
              Y(I, v), I.prototype = v === null ? Object.create(v) : (T.prototype = v.prototype, new T)
            }

            function gt(I, v) {
              return I << v | I >>> 32 - v
            }

            function dt(I, v) {
              return I >>> v | I << 32 - v
            }

            function ot(I, v) {
              return I >>> v
            }

            function ht(I, v, T) {
              return I ^ v ^ T
            }

            function $(I, v, T) {
              return I & v ^ ~I & T
            }

            function ft(I, v, T) {
              return I & v ^ I & T ^ v & T
            }

            function ut(I) {
              return dt(I, 2) ^ dt(I, 13) ^ dt(I, 22)
            }

            function At(I, v) {
              var T = (65535 & I) + (65535 & v);
              return (65535 & (I >>> 16) + (v >>> 16) + (T >>> 16)) << 16 | 65535 & T
            }

            function jt(I, v, T, C) {
              var F = (65535 & I) + (65535 & v) + (65535 & T) + (65535 & C);
              return (65535 & (I >>> 16) + (v >>> 16) + (T >>> 16) + (C >>> 16) + (F >>> 16)) << 16 | 65535 & F
            }

            function Nt(I, v, T, C, F) {
              var M = (65535 & I) + (65535 & v) + (65535 & T) + (65535 & C) + (65535 & F);
              return (65535 & (I >>> 16) + (v >>> 16) + (T >>> 16) + (C >>> 16) + (F >>> 16) + (M >>> 16)) << 16 | 65535 & M
            }

            function Ot(I) {
              return dt(I, 7) ^ dt(I, 18) ^ ot(I, 3)
            }

            function ue(I) {
              return dt(I, 6) ^ dt(I, 11) ^ dt(I, 25)
            }

            function de(I) {
              return [1732584193, 4023233417, 2562383102, 271733878, 3285377520]
            }

            function ae(I, v) {
              var T, C, F, M, N, q, j, X = [];
              for (T = v[0], C = v[1], F = v[2], M = v[3], N = v[4], j = 0; j < 80; j += 1) X[j] = j < 16 ? I[j] : gt(X[j - 3] ^ X[j - 8] ^ X[j - 14] ^ X[j - 16], 1), q = j < 20 ? Nt(gt(T, 5), $(C, F, M), N, 1518500249, X[j]) : j < 40 ? Nt(gt(T, 5), ht(C, F, M), N, 1859775393, X[j]) : j < 60 ? Nt(gt(T, 5), ft(C, F, M), N, 2400959708, X[j]) : Nt(gt(T, 5), ht(C, F, M), N, 3395469782, X[j]), N = M, M = F, F = gt(C, 30), C = T, T = q;
              return v[0] = At(T, v[0]), v[1] = At(C, v[1]), v[2] = At(F, v[2]), v[3] = At(M, v[3]), v[4] = At(N, v[4]), v
            }

            function pe(I, v, T, C) {
              for (var F, M = 15 + (v + 65 >>> 9 << 4), N = v + T; I.length <= M;) I.push(0);
              for (I[v >>> 5] |= 128 << 24 - v % 32, I[M] = 4294967295 & N, I[M - 1] = N / 4294967296 | 0, F = 0; F < I.length; F += 16) C = ae(I.slice(F, F + 16), C);
              return C
            }
            var me = function (I) {
              function v(T, C, F) {
                var M = this;
                if (T !== "SHA-1") throw new Error(R);
                var N = F || {};
                return (M = I.call(this, T, C, F) || this).g = !0, M.F = M.Y, M.C = -1, M.p = f(M.t, M.i, M.C), M.R = ae, M.B = function (q) {
                  return q.slice()
                }, M.L = de, M.K = pe, M.m = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], M.S = 512, M.U = 160, M.T = !1, N.hmacKey && M.k(z("hmacKey", N.hmacKey, M.C)), M
              }
              return mt(v, I), v
            }(U);

            function re(I) {
              return I == "SHA-224" ? x.slice() : S.slice()
            }

            function ne(I, v) {
              var T, C, F, M, N, q, j, X, at, K, Z, wt, G = [];
              for (T = v[0], C = v[1], F = v[2], M = v[3], N = v[4], q = v[5], j = v[6], X = v[7], Z = 0; Z < 64; Z += 1) G[Z] = Z < 16 ? I[Z] : jt(dt(wt = G[Z - 2], 17) ^ dt(wt, 19) ^ ot(wt, 10), G[Z - 7], Ot(G[Z - 15]), G[Z - 16]), at = Nt(X, ue(N), $(N, q, j), y[Z], G[Z]), K = At(ut(T), ft(T, C, F)), X = j, j = q, q = N, N = At(M, at), M = F, F = C, C = T, T = At(at, K);
              return v[0] = At(T, v[0]), v[1] = At(C, v[1]), v[2] = At(F, v[2]), v[3] = At(M, v[3]), v[4] = At(N, v[4]), v[5] = At(q, v[5]), v[6] = At(j, v[6]), v[7] = At(X, v[7]), v
            }
            var vn = function (I) {
                function v(T, C, F) {
                  var M = this;
                  if (T !== "SHA-224" && T !== "SHA-256") throw new Error(R);
                  var N = F || {};
                  return (M = I.call(this, T, C, F) || this).F = M.Y, M.g = !0, M.C = -1, M.p = f(M.t, M.i, M.C), M.R = ne, M.B = function (q) {
                    return q.slice()
                  }, M.L = re, M.K = function (q, j, X, at) {
                    return function (K, Z, wt, G, Tt) {
                      for (var Mt, It = 15 + (Z + 65 >>> 9 << 4), zt = Z + wt; K.length <= It;) K.push(0);
                      for (K[Z >>> 5] |= 128 << 24 - Z % 32, K[It] = 4294967295 & zt, K[It - 1] = zt / 4294967296 | 0, Mt = 0; Mt < K.length; Mt += 16) G = ne(K.slice(Mt, Mt + 16), G);
                      return Tt === "SHA-224" ? [G[0], G[1], G[2], G[3], G[4], G[5], G[6]] : G
                    }(q, j, X, at, T)
                  }, M.m = re(T), M.S = 512, M.U = T === "SHA-224" ? 224 : 256, M.T = !1, N.hmacKey && M.k(z("hmacKey", N.hmacKey, M.C)), M
                }
                return mt(v, I), v
              }(U),
              L = function (I, v) {
                this.N = I, this.I = v
              };

            function ka(I, v) {
              var T;
              return v > 32 ? (T = 64 - v, new L(I.I << v | I.N >>> T, I.N << v | I.I >>> T)) : v !== 0 ? (T = 32 - v, new L(I.N << v | I.I >>> T, I.I << v | I.N >>> T)) : I
            }

            function xe(I, v) {
              var T;
              return v < 32 ? (T = 32 - v, new L(I.N >>> v | I.I << T, I.I >>> v | I.N << T)) : (T = 64 - v, new L(I.I >>> v | I.N << T, I.N >>> v | I.I << T))
            }

            function Aa(I, v) {
              return new L(I.N >>> v, I.I >>> v | I.N << 32 - v)
            }

            function xn(I, v, T) {
              return new L(I.N & v.N ^ ~I.N & T.N, I.I & v.I ^ ~I.I & T.I)
            }

            function kn(I, v, T) {
              return new L(I.N & v.N ^ I.N & T.N ^ v.N & T.N, I.I & v.I ^ I.I & T.I ^ v.I & T.I)
            }

            function An(I) {
              var v = xe(I, 28),
                T = xe(I, 34),
                C = xe(I, 39);
              return new L(v.N ^ T.N ^ C.N, v.I ^ T.I ^ C.I)
            }

            function ge(I, v) {
              var T, C;
              T = (65535 & I.I) + (65535 & v.I);
              var F = (65535 & (C = (I.I >>> 16) + (v.I >>> 16) + (T >>> 16))) << 16 | 65535 & T;
              return T = (65535 & I.N) + (65535 & v.N) + (C >>> 16), C = (I.N >>> 16) + (v.N >>> 16) + (T >>> 16), new L((65535 & C) << 16 | 65535 & T, F)
            }

            function bn(I, v, T, C) {
              var F, M;
              F = (65535 & I.I) + (65535 & v.I) + (65535 & T.I) + (65535 & C.I);
              var N = (65535 & (M = (I.I >>> 16) + (v.I >>> 16) + (T.I >>> 16) + (C.I >>> 16) + (F >>> 16))) << 16 | 65535 & F;
              return F = (65535 & I.N) + (65535 & v.N) + (65535 & T.N) + (65535 & C.N) + (M >>> 16), M = (I.N >>> 16) + (v.N >>> 16) + (T.N >>> 16) + (C.N >>> 16) + (F >>> 16), new L((65535 & M) << 16 | 65535 & F, N)
            }

            function Mn(I, v, T, C, F) {
              var M, N;
              M = (65535 & I.I) + (65535 & v.I) + (65535 & T.I) + (65535 & C.I) + (65535 & F.I);
              var q = (65535 & (N = (I.I >>> 16) + (v.I >>> 16) + (T.I >>> 16) + (C.I >>> 16) + (F.I >>> 16) + (M >>> 16))) << 16 | 65535 & M;
              return M = (65535 & I.N) + (65535 & v.N) + (65535 & T.N) + (65535 & C.N) + (65535 & F.N) + (N >>> 16), N = (I.N >>> 16) + (v.N >>> 16) + (T.N >>> 16) + (C.N >>> 16) + (F.N >>> 16) + (M >>> 16), new L((65535 & N) << 16 | 65535 & M, q)
            }

            function di(I, v) {
              return new L(I.N ^ v.N, I.I ^ v.I)
            }

            function Sn(I) {
              var v = xe(I, 1),
                T = xe(I, 8),
                C = Aa(I, 7);
              return new L(v.N ^ T.N ^ C.N, v.I ^ T.I ^ C.I)
            }

            function En(I) {
              var v = xe(I, 14),
                T = xe(I, 18),
                C = xe(I, 41);
              return new L(v.N ^ T.N ^ C.N, v.I ^ T.I ^ C.I)
            }
            var Tn = [new L(y[0], 3609767458), new L(y[1], 602891725), new L(y[2], 3964484399), new L(y[3], 2173295548), new L(y[4], 4081628472), new L(y[5], 3053834265), new L(y[6], 2937671579), new L(y[7], 3664609560), new L(y[8], 2734883394), new L(y[9], 1164996542), new L(y[10], 1323610764), new L(y[11], 3590304994), new L(y[12], 4068182383), new L(y[13], 991336113), new L(y[14], 633803317), new L(y[15], 3479774868), new L(y[16], 2666613458), new L(y[17], 944711139), new L(y[18], 2341262773), new L(y[19], 2007800933), new L(y[20], 1495990901), new L(y[21], 1856431235), new L(y[22], 3175218132), new L(y[23], 2198950837), new L(y[24], 3999719339), new L(y[25], 766784016), new L(y[26], 2566594879), new L(y[27], 3203337956), new L(y[28], 1034457026), new L(y[29], 2466948901), new L(y[30], 3758326383), new L(y[31], 168717936), new L(y[32], 1188179964), new L(y[33], 1546045734), new L(y[34], 1522805485), new L(y[35], 2643833823), new L(y[36], 2343527390), new L(y[37], 1014477480), new L(y[38], 1206759142), new L(y[39], 344077627), new L(y[40], 1290863460), new L(y[41], 3158454273), new L(y[42], 3505952657), new L(y[43], 106217008), new L(y[44], 3606008344), new L(y[45], 1432725776), new L(y[46], 1467031594), new L(y[47], 851169720), new L(y[48], 3100823752), new L(y[49], 1363258195), new L(y[50], 3750685593), new L(y[51], 3785050280), new L(y[52], 3318307427), new L(y[53], 3812723403), new L(y[54], 2003034995), new L(y[55], 3602036899), new L(y[56], 1575990012), new L(y[57], 1125592928), new L(y[58], 2716904306), new L(y[59], 442776044), new L(y[60], 593698344), new L(y[61], 3733110249), new L(y[62], 2999351573), new L(y[63], 3815920427), new L(3391569614, 3928383900), new L(3515267271, 566280711), new L(3940187606, 3454069534), new L(4118630271, 4000239992), new L(116418474, 1914138554), new L(174292421, 2731055270), new L(289380356, 3203993006), new L(460393269, 320620315), new L(685471733, 587496836), new L(852142971, 1086792851), new L(1017036298, 365543100), new L(1126000580, 2618297676), new L(1288033470, 3409855158), new L(1501505948, 4234509866), new L(1607167915, 987167468), new L(1816402316, 1246189591)];

            function ba(I) {
              return I === "SHA-384" ? [new L(3418070365, x[0]), new L(1654270250, x[1]), new L(2438529370, x[2]), new L(355462360, x[3]), new L(1731405415, x[4]), new L(41048885895, x[5]), new L(3675008525, x[6]), new L(1203062813, x[7])] : [new L(S[0], 4089235720), new L(S[1], 2227873595), new L(S[2], 4271175723), new L(S[3], 1595750129), new L(S[4], 2917565137), new L(S[5], 725511199), new L(S[6], 4215389547), new L(S[7], 327033209)]
            }

            function Ma(I, v) {
              var T, C, F, M, N, q, j, X, at, K, Z, wt, G, Tt, Mt, It, zt = [];
              for (T = v[0], C = v[1], F = v[2], M = v[3], N = v[4], q = v[5], j = v[6], X = v[7], Z = 0; Z < 80; Z += 1) Z < 16 ? (wt = 2 * Z, zt[Z] = new L(I[wt], I[wt + 1])) : zt[Z] = bn((G = zt[Z - 2], Tt = void 0, Mt = void 0, It = void 0, Tt = xe(G, 19), Mt = xe(G, 61), It = Aa(G, 6), new L(Tt.N ^ Mt.N ^ It.N, Tt.I ^ Mt.I ^ It.I)), zt[Z - 7], Sn(zt[Z - 15]), zt[Z - 16]), at = Mn(X, En(N), xn(N, q, j), Tn[Z], zt[Z]), K = ge(An(T), kn(T, C, F)), X = j, j = q, q = N, N = ge(M, at), M = F, F = C, C = T, T = ge(at, K);
              return v[0] = ge(T, v[0]), v[1] = ge(C, v[1]), v[2] = ge(F, v[2]), v[3] = ge(M, v[3]), v[4] = ge(N, v[4]), v[5] = ge(q, v[5]), v[6] = ge(j, v[6]), v[7] = ge(X, v[7]), v
            }
            var Rn = function (I) {
                function v(T, C, F) {
                  var M = this;
                  if (T !== "SHA-384" && T !== "SHA-512") throw new Error(R);
                  var N = F || {};
                  return (M = I.call(this, T, C, F) || this).F = M.Y, M.g = !0, M.C = -1, M.p = f(M.t, M.i, M.C), M.R = Ma, M.B = function (q) {
                    return q.slice()
                  }, M.L = ba, M.K = function (q, j, X, at) {
                    return function (K, Z, wt, G, Tt) {
                      for (var Mt, It = 31 + (Z + 129 >>> 10 << 5), zt = Z + wt; K.length <= It;) K.push(0);
                      for (K[Z >>> 5] |= 128 << 24 - Z % 32, K[It] = 4294967295 & zt, K[It - 1] = zt / 4294967296 | 0, Mt = 0; Mt < K.length; Mt += 32) G = Ma(K.slice(Mt, Mt + 32), G);
                      return Tt === "SHA-384" ? [(G = G)[0].N, G[0].I, G[1].N, G[1].I, G[2].N, G[2].I, G[3].N, G[3].I, G[4].N, G[4].I, G[5].N, G[5].I] : [G[0].N, G[0].I, G[1].N, G[1].I, G[2].N, G[2].I, G[3].N, G[3].I, G[4].N, G[4].I, G[5].N, G[5].I, G[6].N, G[6].I, G[7].N, G[7].I]
                    }(q, j, X, at, T)
                  }, M.m = ba(T), M.S = 1024, M.U = T === "SHA-384" ? 384 : 512, M.T = !1, N.hmacKey && M.k(z("hmacKey", N.hmacKey, M.C)), M
                }
                return mt(v, I), v
              }(U),
              In = [new L(0, 1), new L(0, 32898), new L(2147483648, 32906), new L(2147483648, 2147516416), new L(0, 32907), new L(0, 2147483649), new L(2147483648, 2147516545), new L(2147483648, 32777), new L(0, 138), new L(0, 136), new L(0, 2147516425), new L(0, 2147483658), new L(0, 2147516555), new L(2147483648, 139), new L(2147483648, 32905), new L(2147483648, 32771), new L(2147483648, 32770), new L(2147483648, 128), new L(0, 32778), new L(2147483648, 2147483658), new L(2147483648, 2147516545), new L(2147483648, 32896), new L(0, 2147483649), new L(2147483648, 2147516424)],
              Cn = [
                [0, 36, 3, 41, 18],
                [1, 44, 10, 45, 2],
                [62, 6, 43, 15, 61],
                [28, 55, 25, 21, 56],
                [27, 20, 39, 8, 14]
              ];

            function As(I) {
              var v, T = [];
              for (v = 0; v < 5; v += 1) T[v] = [new L(0, 0), new L(0, 0), new L(0, 0), new L(0, 0), new L(0, 0)];
              return T
            }

            function Pn(I) {
              var v, T = [];
              for (v = 0; v < 5; v += 1) T[v] = I[v].slice();
              return T
            }

            function Pi(I, v) {
              var T, C, F, M, N, q, j, X, at, K = [],
                Z = [];
              if (I !== null)
                for (C = 0; C < I.length; C += 2) v[(C >>> 1) % 5][(C >>> 1) / 5 | 0] = di(v[(C >>> 1) % 5][(C >>> 1) / 5 | 0], new L(I[C + 1], I[C]));
              for (T = 0; T < 24; T += 1) {
                for (M = As(), C = 0; C < 5; C += 1) K[C] = (N = v[C][0], q = v[C][1], j = v[C][2], X = v[C][3], at = v[C][4], new L(N.N ^ q.N ^ j.N ^ X.N ^ at.N, N.I ^ q.I ^ j.I ^ X.I ^ at.I));
                for (C = 0; C < 5; C += 1) Z[C] = di(K[(C + 4) % 5], ka(K[(C + 1) % 5], 1));
                for (C = 0; C < 5; C += 1)
                  for (F = 0; F < 5; F += 1) v[C][F] = di(v[C][F], Z[C]);
                for (C = 0; C < 5; C += 1)
                  for (F = 0; F < 5; F += 1) M[F][(2 * C + 3 * F) % 5] = ka(v[C][F], Cn[C][F]);
                for (C = 0; C < 5; C += 1)
                  for (F = 0; F < 5; F += 1) v[C][F] = di(M[C][F], new L(~M[(C + 1) % 5][F].N & M[(C + 2) % 5][F].N, ~M[(C + 1) % 5][F].I & M[(C + 2) % 5][F].I));
                v[0][0] = di(v[0][0], In[T])
              }
              return v
            }

            function Sa(I) {
              var v, T, C = 0,
                F = [0, 0],
                M = [4294967295 & I, I / 4294967296 & 2097151];
              for (v = 6; v >= 0; v--)(T = M[v >> 2] >>> 8 * v & 255) === 0 && C === 0 || (F[C + 1 >> 2] |= T << 8 * (C + 1), C += 1);
              return C = C !== 0 ? C : 1, F[0] |= C, {
                value: C + 1 > 4 ? F : [F[0]],
                binLen: 8 + 8 * C
              }
            }

            function bs(I) {
              return A(Sa(I.binLen), I)
            }

            function Ea(I, v) {
              var T, C = Sa(v),
                F = v >>> 2,
                M = (F - (C = A(C, I)).value.length % F) % F;
              for (T = 0; T < M; T++) C.value.push(0);
              return C.value
            }
            var Fn = function (I) {
              function v(T, C, F) {
                var M = this,
                  N = 6,
                  q = 0,
                  j = F || {};
                if ((M = I.call(this, T, C, F) || this).numRounds !== 1) {
                  if (j.kmacKey || j.hmacKey) throw new Error("Cannot set numRounds with MAC");
                  if (M.o === "CSHAKE128" || M.o === "CSHAKE256") throw new Error("Cannot set numRounds for CSHAKE variants")
                }
                switch (M.C = 1, M.p = f(M.t, M.i, M.C), M.R = Pi, M.B = Pn, M.L = As, M.m = As(), M.T = !1, T) {
                  case "SHA3-224":
                    M.S = q = 1152, M.U = 224, M.g = !0, M.F = M.Y;
                    break;
                  case "SHA3-256":
                    M.S = q = 1088, M.U = 256, M.g = !0, M.F = M.Y;
                    break;
                  case "SHA3-384":
                    M.S = q = 832, M.U = 384, M.g = !0, M.F = M.Y;
                    break;
                  case "SHA3-512":
                    M.S = q = 576, M.U = 512, M.g = !0, M.F = M.Y;
                    break;
                  case "SHAKE128":
                    N = 31, M.S = q = 1344, M.U = -1, M.T = !0, M.g = !1, M.F = null;
                    break;
                  case "SHAKE256":
                    N = 31, M.S = q = 1088, M.U = -1, M.T = !0, M.g = !1, M.F = null;
                    break;
                  case "KMAC128":
                    N = 4, M.S = q = 1344, M.M(F), M.U = -1, M.T = !0, M.g = !1, M.F = M.X;
                    break;
                  case "KMAC256":
                    N = 4, M.S = q = 1088, M.M(F), M.U = -1, M.T = !0, M.g = !1, M.F = M.X;
                    break;
                  case "CSHAKE128":
                    M.S = q = 1344, N = M.O(F), M.U = -1, M.T = !0, M.g = !1, M.F = null;
                    break;
                  case "CSHAKE256":
                    M.S = q = 1088, N = M.O(F), M.U = -1, M.T = !0, M.g = !1, M.F = null;
                    break;
                  default:
                    throw new Error(R)
                }
                return M.K = function (X, at, K, Z, wt) {
                  return function (G, Tt, Mt, It, zt, Te, te) {
                    var _e, Ms, Fi = 0,
                      pi = [],
                      Di = zt >>> 5,
                      Dn = Tt >>> 5;
                    for (_e = 0; _e < Dn && Tt >= zt; _e += Di) It = Pi(G.slice(_e, _e + Di), It), Tt -= zt;
                    for (G = G.slice(_e), Tt %= zt; G.length < Di;) G.push(0);
                    for (G[(_e = Tt >>> 3) >> 2] ^= Te << _e % 4 * 8, G[Di - 1] ^= 2147483648, It = Pi(G, It); 32 * pi.length < te && (Ms = It[Fi % 5][Fi / 5 | 0], pi.push(Ms.I), !(32 * pi.length >= te));) pi.push(Ms.N), 64 * (Fi += 1) % zt == 0 && (Pi(null, It), Fi = 0);
                    return pi
                  }(X, at, 0, Z, q, N, wt)
                }, j.hmacKey && M.k(z("hmacKey", j.hmacKey, M.C)), M
              }
              return mt(v, I), v.prototype.O = function (T, C) {
                var F = function (j) {
                  var X = j || {};
                  return {
                    funcName: z("funcName", X.funcName, 1, {
                      value: [],
                      binLen: 0
                    }),
                    customization: z("Customization", X.customization, 1, {
                      value: [],
                      binLen: 0
                    })
                  }
                }(T || {});
                C && (F.funcName = C);
                var M = A(bs(F.funcName), bs(F.customization));
                if (F.customization.binLen !== 0 || F.funcName.binLen !== 0) {
                  for (var N = Ea(M, this.S >>> 3), q = 0; q < N.length; q += this.S >>> 5) this.m = this.R(N.slice(q, q + (this.S >>> 5)), this.m), this.v += this.S;
                  return 4
                }
                return 31
              }, v.prototype.M = function (T) {
                var C = function (N) {
                  var q = N || {};
                  return {
                    kmacKey: z("kmacKey", q.kmacKey, 1),
                    funcName: {
                      value: [1128353099],
                      binLen: 32
                    },
                    customization: z("Customization", q.customization, 1, {
                      value: [],
                      binLen: 0
                    })
                  }
                }(T || {});
                this.O(T, C.funcName);
                for (var F = Ea(bs(C.kmacKey), this.S >>> 3), M = 0; M < F.length; M += this.S >>> 5) this.m = this.R(F.slice(M, M + (this.S >>> 5)), this.m), this.v += this.S;
                this.A = !0
              }, v.prototype.X = function (T) {
                var C = A({
                  value: this.u.slice(),
                  binLen: this.s
                }, function (F) {
                  var M, N, q = 0,
                    j = [0, 0],
                    X = [4294967295 & F, F / 4294967296 & 2097151];
                  for (M = 6; M >= 0; M--)(N = X[M >> 2] >>> 8 * M & 255) == 0 && q === 0 || (j[q >> 2] |= N << 8 * q, q += 1);
                  return j[(q = q !== 0 ? q : 1) >> 2] |= q << 8 * q, {
                    value: q + 1 > 4 ? j : [j[0]],
                    binLen: 8 + 8 * q
                  }
                }(T.outputLen));
                return this.K(C.value, C.binLen, this.v, this.B(this.m), T.outputLen)
              }, v
            }(U);
            return function () {
              function I(v, T, C) {
                if (v == "SHA-1") this.j = new me(v, T, C);
                else if (v == "SHA-224" || v == "SHA-256") this.j = new vn(v, T, C);
                else if (v == "SHA-384" || v == "SHA-512") this.j = new Rn(v, T, C);
                else {
                  if (v != "SHA3-224" && v != "SHA3-256" && v != "SHA3-384" && v != "SHA3-512" && v != "SHAKE128" && v != "SHAKE256" && v != "CSHAKE128" && v != "CSHAKE256" && v != "KMAC128" && v != "KMAC256") throw new Error(R);
                  this.j = new Fn(v, T, C)
                }
              }
              return I.prototype.update = function (v) {
                this.j.update(v)
              }, I.prototype.getHash = function (v, T) {
                return this.j.getHash(v, T)
              }, I.prototype.setHMACKey = function (v, T, C) {
                this.j.setHMACKey(v, T, C)
              }, I.prototype.getHMAC = function (v, T) {
                return this.j.getHMAC(v, T)
              }, I
            }()
          })
        }, function (r) {
          var n = {};
          return i(n[r], r)
        }), i(1658745339199)
      }();
      async function bi(l, t, i, r, n, c) {
        const d = Object.keys(i || {}),
          m = d.length ? d.map(w => `${w}=${encodeURIComponent(i[w])}`).join("&") : void 0,
          f = l + (m ? `?${m}` : "");
        return new Promise((w, y) => {
          wx.request({
            url: f,
            method: t,
            header: r,
            data: n,
            timeout: c,
            success: x => {
              w(x.data)
            },
            fail: x => {
              y(x)
            }
          })
        })
      }

      function ai(l) {
        let t = new ts("SHA-256", "TEXT");
        return t.update(l), t.getHash("HEX")
      }

      function gr(l, t, i) {
        let r;
        return function (...n) {
          if (!r) return r = setTimeout(() => r = null, t), l.apply(i, n)
        }
      }

      function Oe(l) {
        const t = new Uint8Array(l);
        return mr(t)
      }

      function Ue(l) {
        return ur(l)
      }

      function _r(l) {
        const t = /^(https?:\/\/)?([^\/]+)/,
          i = l.match(t);
        return i && i[2] ? i[2].split(".")[0] : null
      }
      const $s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        fr = new Uint8Array(256);
      for (let l = 0; l < $s.length; l++) fr[$s.charCodeAt(l)] = l;

      function yr(l) {
        const t = new Array(l.length);
        for (let i = 0; i < l.length; ++i) t[i] = l[i];
        return t
      }

      function es(l) {
        const t = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let i = "";
        for (let r = 0; r < l; ++r) i += t.charAt(Math.floor(Math.random() * t.length));
        return i
      }
      const wr = "https://easyar-calib.easyar.com/intrinsics.json";
      async function vr(l) {
        let t = null;
        l == k.Wechat && (t = bi);
        try {
          return await t(wr, "GET")
        } catch (i) {
          throw i
        }
      }
      const is = Object.freeze(Object.defineProperty({
        __proto__: null,
        sha256: ai,
        throttle: gr,
        data2base64: Oe,
        base64ToArrayBuffer: Ue,
        extractUrlDomain: _r,
        copyArrayBufferToNumbers: yr,
        generateRandomString: es,
        fetchCalibIntrinsics: vr
      }, Symbol.toStringTag, {
        value: "Module"
      }));
      class js {
        constructor() {
          this.blockInstances = []
        }
      }
      class xr {
        get blockServiceHandler() {
          return this._blockServiceHandler
        }
        constructor(t) {
          this._blockServiceHandler = t
        }
        resolve(t, i, r, n, c) {
          return new Promise((d, m) => {
            t.length == 0 && m(new Error("Request sequence is empty"));
            const f = this._blockServiceHandler.requestFrameCount;
            t.length != f && m(new Error(`Frame request sequences size should be ${f}, but it is currently ${t.length}`)), r.length != f && m(new Error(`DeviceAuxiliaryInfo request sequences size should be ${f}, but it is currently ${r.length}`)), n.length != f && m(new Error(`RecentFrameBuffer request sequences size should be ${f}, but it is currently ${n.length}`));
            for (const x of t)(!x.imageString || x.imageString.length == 0) && (!x.imageBuffer || x.imageBuffer.byteLength == 0) && m(new Error("Empty Image when resolving in localizer"));
            const w = new Date().getTime();
            let y = {};
            if (i) try {
              y = JSON.parse(i)
            } catch {
              m(new Error("Fail to parse user message in localizer"))
            }
            y.startTime = w, c != null && (y.arSessionId = c), this._clsRequest(t, r, n, y).then(x => {
              if (x instanceof Error && m(x), bt.getInstance().isRecordingData) {
                let A = x;
                A.frameTimestamp = t[t.length - 1].timestamp, A.appid = this._blockServiceHandler.config.appId, bt.getInstance().recordClsResponse(A)
              }
              const S = new js;
              S.inputFrame = t[t.length - 1], x.arSessionId && (S.arSessionId = x.arSessionId), S.extraInfo = x.extraInfo, S.exceptionInfo = x.msg;
              const R = new Date().getTime();
              S.serverResponseDuration = R - w, S.serverCalculationDuration = x.duration, x.statusCode != 0 ? x.statusCode == 17 ? S.localizerStatus = Bt.NotFound : x.statusCode == 21 ? S.localizerStatus = Bt.QpsLimitExceeded : x.statusCode == 100017 ? S.localizerStatus = Bt.WakingUp : S.localizerStatus = Bt.UnknownError : (S.localizerStatus = Bt.Found, x.result && S.blockInstances.push(J.fromBlockLocalizationResult(x.result[0]))), d(S)
            })
          })
        }
        _clsRequest(t, i, r, n) {
          const c = this._blockServiceHandler.composeRequestParams(t, i, r, n);
          if (bt.getInstance().isRecordingData)
            if (t.length == 1) t[0].imageString && t[0].imageString.length > 0 ? bt.getInstance().recordRequestArgs({
              ...JSON.parse(c.args),
              base64: t[0].imageString
            }) : t[0].imageBuffer && t[0].imageBuffer.byteLength > 0 ? bt.getInstance().recordRequestArgs({
              ...JSON.parse(c.args),
              base64: Oe(t[0].imageBuffer)
            }) : bt.getInstance().recordRequestArgs({
              ...JSON.parse(c.args)
            });
            else {
              let d = null,
                m = null;
              t[0].imageString && t[0].imageString.length > 0 ? d = t[0].imageString : t[0].imageBuffer && t[0].imageBuffer.byteLength > 0 && (d = Oe(t[0].imageBuffer)), t[1].imageString && t[1].imageString.length > 0 ? m = t[1].imageString : t[1].imageBuffer && t[1].imageBuffer.byteLength > 0 && (m = Oe(t[1].imageBuffer)), d && d.length > 0 ? bt.getInstance().recordRequestArgs({
                ...JSON.parse(c.pres),
                base64: d
              }) : bt.getInstance().recordRequestArgs({
                ...JSON.parse(c.pres)
              }), m && m.length > 0 ? bt.getInstance().recordRequestArgs({
                ...JSON.parse(c.args),
                base64: m
              }) : bt.getInstance().recordRequestArgs({
                ...JSON.parse(c.args)
              })
            } if (t.length <= 1) {
            if (t[0].imageBuffer && t[0].imageBuffer.byteLength > 0) return this._blockServiceHandler.requestServiceSingleImage(c, t[0].imageBuffer, !1);
            if (t[0].imageString && t[0].imageString.length > 0) return this._blockServiceHandler.requestServiceSingleImage(c, t[0].imageString, !0);
            et.log("No image buffer nor string at block cls request")
          }
          return this._blockServiceHandler.requestService(c, t)
        }
      }
      class ss {
        constructor() {
          this._isTrial = !1, this._initFlag = !1
        }
        get isTrial() {
          return this._isTrial
        }
        get initFlag() {
          return this._initFlag
        }
      }
      var ri = (l => (l[l.V6_And_Later = 6] = "V6_And_Later", l[l.V5 = 5] = "V5", l[l.V4_And_Before = 4] = "V4_And_Before", l))(ri || {});

      function Hs(l, t) {
        let i = JSON.stringify(l);
        return De("https://posefusion.easyar.com/pose/v1", "POST", null, null, i).then(r => t(r))
      }
      const kr = 300,
        Gs = "https://uac.easyar.com";
      let De = null;
      class Ws extends ss {
        constructor(t, i) {
          super(), this._pathPostfix = "", this._fullPath = "", this._clsHost = null, this._token = "", this._tokenExpireTime = 0, this._requestInterval = 1e3, this._timeout = 6e3, this._usingGstratFlag = !1, this._boundaryStr = "THISISABOUNDARYASDEFAULT", this._versionTag = null, this._switchBlockService = new V, this._clsConfig = t, this._boundaryStr = es(32), i == k.Wechat && (De = bi)
        }
        get fullPath() {
          return this._fullPath
        }
        get clsHost() {
          return this._clsHost
        }
        get token() {
          return this._token
        }
        get config() {
          return this._clsConfig
        }
        get requestInterval() {
          return this._requestInterval
        }
        get requestTimeout() {
          return this._timeout
        }
        get switchBlockServiceEvent() {
          return this._switchBlockService.event
        }
        get versionTag() {
          return this._versionTag
        }
        get isUsingGstrat() {
          return this._usingGstratFlag
        }
        get requestFrameCount() {
          return this._usingGstratFlag ? 2 : 1
        }
        async initialize() {
          try {
            if (this._validateClsConfig(), this._clsHost = this._queryUrlHost(), await this.refreshToken(), await this._getClsInfo()) this._checkUrl(), this._initFlag = !0;
            else throw new Error(`Fail to get CLS info from ${this._clsHost}/cls/client/mega/info`)
          } catch (t) {
            throw t
          }
        }
        reset() {
          this._isTrial = !1, this._initFlag = !1, this._pathPostfix = "", this._fullPath = "", this._clsConfig = null, this._clsHost = null, this._token = "", this._tokenExpireTime = 0
        }
        setRequestConfig(t) {
          if (t.requestInterval < 300) throw new Error("Cannot set requestInterval less than 300ms");
          if (t.timeout < 5e3) throw new Error("Cannot set timeout less than 5000ms");
          this._requestInterval = t.requestInterval, this._timeout = t.timeout
        }
        async refreshToken() {
          const t = kr,
            i = new Date().getTime() + t * 1e3,
            r = `[{"service":"ecs:cls","effect":"Allow","resource":["${this._clsConfig.appId}"],"permission":["READ","WRITE"]}]`;
          let n = {};
          n.expires = t.toString(), n.timestamp = i.toString(), n.apiKey = this._clsConfig.apiKey, n.acl = r;
          console.log(n, 'refreshToken');
          let c = Object.keys(n).sort().map(d => `${d}${n[d]}`).concat(this._clsConfig.apiSecret).join("");
          n.signature = ai(c);
          try {
            const d = await De(`${Gs}/token/v2`, "POST", null, null, n);
            if (d.statusCode == 0) et.log("Block token refreshed"), this._token = d.result.token, this._tokenExpireTime = i;
            else throw new Error(`${d.msg} from ${Gs}/token/v2`)
          } catch (d) {
            throw d
          }
        }
        composeRequestParams(t, i, r, n) {
          return this._versionTag <= 4 ? this._composeRequestParamsLegacy(t[0], i[0], n) : this._composeRequestParams(t, i, r, n)
        }
        async requestServiceSingleImage(t, i, r = !0) {
          if (!i) return new Error("No image at cls request with single image");
          this._isTokenExpired() && await this.refreshToken();
          let n = null;
          if (r === !0) {
            if (i.length == 0) return new Error("Empty image string at cls request with single image string");
            et.log("Block cls with single image from string"), n = Ue(i.substr(23))
          } else {
            if (i.byteLength == 0) return new Error("Empty image buffer at cls request with single image buffer");
            et.log("Block cls with single image from buffer"), n = i
          }
          console.log(t, 'requestServiceSingleImage');
          let c = Object.keys(t).map(R => `\r
--${this._boundaryStr}\r
Content-Disposition: form-data;name="${R}"\r
\r
` + t[R]).join("") + `\r
--${this._boundaryStr}\r
Content-Disposition: form-data;name="image"; filename="image.jpg"\r
Content-Type: application/octet-stream\r
Content-Transfer-Encoding: binary\r
\r
`,
            d = `\r
--${this._boundaryStr}--`,
            m = new yt.TextEncoder,
            f = m.encode(c),
            w = new Uint8Array(n),
            y = m.encode(d),
            x = new Uint8Array(f.length + w.length + y.length);
          x.set(f, 0), x.set(w, f.length), x.set(y, f.length + w.length);
          const S = {
            "content-type": "multipart/form-data; boundary=" + this._boundaryStr,
            Authorization: this._token
          };
          return De(this._fullPath, "POST", null, S, x.buffer, this._timeout)
        }
        async requestService(t, i) {
          if (!i) return new Error("No frame datas at cls request");
          if (i.length < 2) return new Error("No enough frame datas at cls request");
          if ((!i[0].imageString || i[0].imageString.length == 0) && (!i[0].imageBuffer || i[0].imageBuffer.byteLength == 0)) return new Error("Pre frame lacks image at cls request");
          if ((!i[1].imageString || i[1].imageString.length == 0) && (!i[1].imageBuffer || i[1].imageBuffer.byteLength == 0)) return new Error("Pre frame lacks image at cls request");
          this._isTokenExpired() && await this.refreshToken();
          let r = null,
            n = null;
          i[0].imageString && i[0].imageString.length > 0 ? (r = Ue(i[0].imageString.substr(23)), et.log("Block cls with two images. The first image is from string")) : (r = i[0].imageBuffer, et.log("Block cls with two images. The first image is from buffer")), i[1].imageString && i[1].imageString.length > 0 ? (n = Ue(i[1].imageString.substr(23)), et.log("Block cls with two images. The second image is from string")) : (n = i[1].imageBuffer, et.log("Block cls with two images. The second image is from buffer"));
          console.log(t, 'requestService');
          let c = Object.keys(t).map(U => `\r
--${this._boundaryStr}\r
Content-Disposition: form-data;name="${U}"\r
\r
` + t[U]).join("") + `\r
--${this._boundaryStr}\r
Content-Disposition: form-data;name="image"; filename="image.jpg"\r
Content-Type: application/octet-stream\r
Content-Transfer-Encoding: binary\r
\r
`,
            d = `\r
--${this._boundaryStr}\r
Content-Disposition: form-data;name="preImage"; filename="preImage.jpg"\r
Content-Type: application/octet-stream\r
Content-Transfer-Encoding: binary\r
\r
`,
            m = `\r
--${this._boundaryStr}--`,
            f = new yt.TextEncoder,
            w = f.encode(c),
            y = new Uint8Array(n),
            x = f.encode(d),
            S = new Uint8Array(r),
            R = f.encode(m),
            A = new Uint8Array(w.length + y.length + x.length + S.length + R.length),
            P = 0;
          A.set(w, P), P += w.length, A.set(y, P), P += y.length, A.set(x, P), P += x.length, A.set(S, P), P += S.length, A.set(R, P), P += R.length;
          const z = {
            "content-type": "multipart/form-data; boundary=" + this._boundaryStr,
            Authorization: this._token
          };
          return De(this._fullPath, "POST", null, z, A.buffer, this._timeout)
        }
        async getEmaRawData(t) {
          try {
            const i = await this._getEmaUrl(t);
            if (i.statusCode != 0) throw new Error("EMA request failed: " + i.msg);
            if (!i.result || !i.result.emaUrl || i.result.emaUrl.length == 0) throw new Error("EMA request succeeded, but result url is empty");
            const r = {
              "content-type": " "
            };
            return De(i.result.emaUrl, "GET", null, r, null)
          } catch (i) {
            throw i
          }
        }
        async switchBlockService(t) {
          try {
            if (t == null) throw new Error("Empty block cls config at switching service.");
            et.log("Block service switched from: ", this._clsConfig.appId, " ,to: ", t.appId), this.reset(), this._clsConfig = t, await this.initialize(), this._switchBlockService.fire()
          } catch (i) {
            throw i
          }
        }
        _isTokenExpired() {
          return new Date().getTime() > this._tokenExpireTime
        }
        _getClsInfo() {
          let t = {};
          return t.appId = this._clsConfig.appId, De(`${this._clsHost}/cls/client/mega/info`, "GET", t, {
            Authorization: this._token
          }, null).then(i => {
            if (i.statusCode > 0) return !1;
            if (i.config) {
              const r = JSON.parse(i.config);
              r && r.gstrat && r.gstrat == 1 && (et.log("CLS library gstrat is : " + r.gstrat), this._usingGstratFlag = !0)
            }
            return this._isTrial = i.trial, i.path && (this._pathPostfix = i.path), !0
          })
        }
        _composeRequestParams(t, i, r, n) {
          let c = null;
          if (t.length == 1) {
            let d = this._prepareRequestData(t[0], i[0], r[0]);
            c = {
              appId: this._clsConfig.appId,
              apiKey: this._clsConfig.apiKey,
              clientSupplier: "wxmpp",
              clientVersion: E,
              timestamp: Date.now(),
              args: JSON.stringify(d),
              ...n
            }, this._versionTag < 6 && (c.cameraParam = t[0].cameraParams.getParamString())
          } else if (t.length >= 2) {
            let d = this._prepareRequestData(t[0], i[0], r[0]),
              m = this._prepareRequestData(t[1], i[1], r[1]);
            c = {
              appId: this._clsConfig.appId,
              apiKey: this._clsConfig.apiKey,
              clientSupplier: "wxmpp",
              clientVersion: E,
              timestamp: Date.now(),
              args: JSON.stringify(m),
              pres: JSON.stringify(d),
              ...n
            }
          }
          return c
        }
        _prepareRequestData(t, i, r) {
          let n = {
            schema: "1.0",
            cameraSize: t.cameraParams.getSize(),
            cameraParam: t.cameraParams.getParam(),
            cameraOrientation: `${t.cameraParams.cameraOrientation}`
          };
          console.log(i.geoLocation, '_prepareRequestData');
          if (i.acce && (n.acce = [`${i.acce.x}`, `${i.acce.y}`, `${i.acce.z}`]), i.geoLocation && (n.location = i.geoLocation, Object.keys(i.geoLocation).forEach(c => {
              n.location[c] = `${i.geoLocation[c]}`
            })), i.proximity) {
            const c = t.timestamp - i.proximity.timestamp;
            c < i.proximity.validTime && (n.prior.xyz = [`${i.proximity.x}`, `${i.proximity.y}`, `${i.proximity.z}`], n.prior.accuracy = `${i.proximity.accuracy}`, n.prior.delay = `${c}`, n.prior.is2d = i.proximity.is2d ? "1" : "0")
          }
          if (i.blockIds && i.blockIds.length > 0 && (n.blockid = i.blockIds), n.frameTimestamp = `${t.timestamp}`, this._versionTag >= 6 && t.cameraTransform) {
            let c = St(t.cameraTransformType, t.trackingStatus, t.cameraTransform);
            c && c.length > 0 && (n.cameraTransformParam = c, n.cameraTransformType = _t[t.cameraTransformType], n.recentFrames = r)
          }
          return n
        }
        _composeRequestParamsLegacy(t, i, r) {
          let n = {
            appId: this._clsConfig.appId,
            cameraParam: t.cameraParams.getParamString(),
            ...r
          };
          return i.geoLocation && (n.location = JSON.stringify(i.geoLocation)), n
        }
        async _getEmaUrl(t) {
          let i = {};
          return i.appId = this._clsConfig.appId, i.apiKey = this._clsConfig.apiKey, i.timestamp = `${Date.now()}`, i.signature = this._calcSignature(i), De(`${this._clsHost}/cls/arannotation/${t}`, "GET", i, null, null)
        }
        _validateClsConfig() {
          var t, i, r;
          if (!this._clsConfig) throw new Error("CloudLocalizer.initialize: Empty Cloud Localization Service Config");
          if (!this._clsConfig.appId || this._clsConfig.appId.length == 0) throw new Error("CloudLocalizer.initialize: AppId is empty");
          if (!this._clsConfig.apiKey || this._clsConfig.apiKey.length == 0) throw new Error("CloudLocalizer.initialize: ApiKey is empty");
          if (!this._clsConfig.apiSecret || this._clsConfig.apiSecret.length == 0) throw new Error("CloudLocalizer.initialize: ApiSecret is empty");
          if (!this._clsConfig.serverAddress || this._clsConfig.serverAddress.length == 0) throw new Error("CloudLocalizer.initialize: ServerAddress is empty");
          this._trimClsConfig();
          const n = "[0-9a-f]",
            c = new RegExp(n, "ig");
          if (((t = this._clsConfig.appId.match(c)) == null ? void 0 : t.length) !== this._clsConfig.appId.length) throw new Error(`CloudLocalizer.initialize: AppId ${this._clsConfig.appId} is invalid`);
          if (((i = this._clsConfig.apiKey.match(c)) == null ? void 0 : i.length) !== this._clsConfig.apiKey.length) throw new Error(`CloudLocalizer.initialize: ApiKey ${this._clsConfig.apiKey} is invalid`);
          if (((r = this._clsConfig.apiSecret.match(c)) == null ? void 0 : r.length) !== this._clsConfig.apiSecret.length) throw new Error(`CloudLocalizer.initialize: ApiSecret ${this._clsConfig.apiSecret} is invalid`)
        }
        _trimClsConfig() {
          this._clsConfig.appId.trim(), this._clsConfig.apiKey.trim(), this._clsConfig.apiSecret.trim(), this._clsConfig.serverAddress.trim()
        }
        _checkUrl() {
          if (!this._pathPostfix || this._pathPostfix.length == 0) {
            this._fullPath = this._clsConfig.serverAddress.toLowerCase();
            return
          }
          this._fullPath = `${this._clsHost}/${this._pathPostfix}`;
          try {
            let t = !1,
              i = null;
            this._pathPostfix.includes("/ext") && (t = !0);
            const r = this._pathPostfix.split("/");
            if (r.length == 0) throw new Error("Invalid path post-fix: " + this._pathPostfix);
            if (i = parseInt(r[0].substring(1)), i >= 6 && t) this._versionTag = 6;
            else if (i == 5 && !t) this._versionTag = 5;
            else if (i < 5 && !t) this._versionTag = 4;
            else throw new Error("Invalid path post-fix combination: " + this._pathPostfix)
          } catch (t) {
            throw t
          }
        }
        _queryUrlHost() {
          const t = "(https?://)([^:^/]*)(:\\d*)?(.*)?",
            i = new RegExp(t, "ig");
          let r = this._clsConfig.serverAddress;
          if (!i.test(r)) throw new Error(`Server Address ${r} is not valid.`);
          const n = r.split(i);
          return `${n[1]}${n[2]}${n[3]||""}`
        }
        _calcSignature(t) {
          console.log(t, '_calcSignature');
          let i = Object.keys(t).sort().map(r => `${r}${t[r]}`).concat(this._clsConfig.apiSecret).join("");
          return ai(i)
        }
      }
      const Ar = 3600,
        Ks = "https://uac.easyar.com",
        Ys = "/vps/v1/ext/file/localize";
      let Ne = null;
      class Xs extends ss {
        constructor(t, i) {
          super(), this._landmarkHost = null, this._token = "", this._requestInterval = 1e3, this._timeout = 6e3, this._usingGstratFlag = !1, this._boundaryStr = "THISISABOUNDARYASDEFAULT", this._landmarkConfig = t, this._boundaryStr = es(32), i == k.Wechat && (Ne = bi)
        }
        get landmarkHost() {
          return this._landmarkHost
        }
        get token() {
          return this._token
        }
        get config() {
          return this._landmarkConfig
        }
        get requestInterval() {
          return this._requestInterval
        }
        get requestTimeout() {
          return this._timeout
        }
        get isUsingGstrat() {
          return this._usingGstratFlag
        }
        get requestFrameCount() {
          return this._usingGstratFlag ? 2 : 1
        }
        async initialize() {
          try {
            this._validateConfig(), await this.refreshToken(), this._landmarkHost = this._queryUrlHost().toLowerCase(), this._initFlag = !0
          } catch (t) {
            throw t
          }
        }
        reset() {
          this._isTrial = !1, this._initFlag = !1, this._landmarkConfig = null, this._landmarkHost = null
        }
        setRequestConfig(t) {
          if (t.requestInterval < 300) throw new Error("Cannot set requestInterval less than 300ms");
          if (t.timeout < 5e3) throw new Error("Cannot set timeout less than 5000ms");
          this._requestInterval = Math.max(t.requestInterval, 300), this._timeout = t.timeout
        }
        async refreshToken() {
          const t = Ar,
            i = new Date().getTime() + t * 1e3,
            r = `[{"service":"ecs:vps1","effect":"Allow","resource":["${this._landmarkConfig.appId}"],"permission":["READ","WRITE"]}]`;
          let n = {};
          n.expires = t.toString(), n.timestamp = i.toString(), n.apiKey = this._landmarkConfig.apiKey, n.acl = r;
          console.log(n, 'refreshToken');
          let c = Object.keys(n).sort().map(d => `${d}${n[d]}`).concat(this._landmarkConfig.apiSecret).join("");
          n.signature = ai(c);
          try {
            const d = await Ne(`${Ks}/token/v2`, "POST", null, null, n);
            if (d.statusCode == 0) et.log("Landmark token refreshed"), this._token = d.result.token, this._tokenExpireTime = i;
            else throw new Error(`${d.msg} from ${Ks}/token/v2`)
          } catch (d) {
            throw d
          }
        }
        composeRequestParams(t, i, r, n) {
          return this._composeRequestParams(t, i, r, n)
        }
        async requestGeoFilter(t) {
          if (!t) return new Error("No gps at geo filtering");
          let i = null;
          t.altitude ? i = `[${t.longitude}, ${t.latitude}, ${t.altitude}]` : i = `[${t.longitude}, ${t.latitude}]`;
          let r = {};
          return r.appId = this._landmarkConfig.appId, r.apiKey = this._landmarkConfig.apiKey, r.gps = i, r.timestamp = `${Date.now()}`, r.signature = this._calcSignature(r), Ne(`${this._landmarkHost}/vps/v1/gps/filter`, "POST", r, null, null)
        }
        async requestServiceSingleImage(t, i, r) {
          if (!i) return new Error("No image at landmark cls request");
          this._isTokenExpired() && await this.refreshToken();
          let n = null;
          if (r === !0) {
            if (i.length == 0) return new Error("Empty image string at cls request with single image string");
            et.log("Landmark cls with single image from string"), n = Ue(i.substr(23))
          } else {
            if (i.byteLength == 0) return new Error("Empty image buffer at cls request with single image buffer");
            et.log("Landmark cls with single image from buffer"), n = i
          }
          console.log(t, 'requestServiceSingleImage');
          let c = Object.keys(t).map(A => `\r
--${this._boundaryStr}\r
Content-Disposition: form-data;name="${A}"\r
\r
` + t[A]).join("") + `\r
--${this._boundaryStr}\r
Content-Disposition: form-data;name="image"; filename="image.jpg"\r
Content-Type: application/octet-stream\r
Content-Transfer-Encoding: binary\r
\r
`,
            d = `\r
--${this._boundaryStr}--`,
            m = new yt.TextEncoder,
            f = m.encode(c),
            w = new Uint8Array(n),
            y = m.encode(d),
            x = new Uint8Array(f.length + w.length + y.length);
          x.set(f, 0), x.set(w, f.length), x.set(y, f.length + w.length);
          let S = x.buffer;
          const R = {
            "content-type": "multipart/form-data; boundary=" + this._boundaryStr,
            Authorization: this._token
          };
          return Ne(this._landmarkHost + Ys, "POST", null, R, S, this._timeout)
        }
        async requestService(t, i) {
          if (!i) return new Error("No frame datas at landmark cls request");
          if (i.length < 2) return new Error("No enough frame datas at landmark cls request");
          if ((!i[0].imageString || i[0].imageString.length == 0) && (!i[0].imageBuffer || i[0].imageBuffer.byteLength == 0)) return new Error("Pre frame lacks image at landmark cls request");
          if ((!i[1].imageString || i[1].imageString.length == 0) && (!i[1].imageBuffer || i[1].imageBuffer.byteLength == 0)) return new Error("Pre frame lacks image at landmark cls request");
          this._isTokenExpired() && await this.refreshToken();
          let r = null,
            n = null;
          i[0].imageString && i[0].imageString.length > 0 ? (r = Ue(i[0].imageString.substr(23)), et.log("Block cls with two images. The first image is from string")) : (r = i[0].imageBuffer, et.log("Block cls with two images. The first image is from buffer")), i[1].imageString && i[1].imageString.length > 0 ? (n = Ue(i[1].imageString.substr(23)), et.log("Block cls with two images. The second image is from string")) : (n = i[1].imageBuffer, et.log("Block cls with two images. The second image is from buffer"));
          console.log(t, 'requestService');
          let c = Object.keys(t).map(U => `\r
--${this._boundaryStr}\r
Content-Disposition: form-data;name="${U}"\r
\r
` + t[U]).join("") + `\r
--${this._boundaryStr}\r
Content-Disposition: form-data;name="image"; filename="image.jpg"\r
Content-Type: application/octet-stream\r
Content-Transfer-Encoding: binary\r
\r
`,
            d = `\r
--${this._boundaryStr}\r
Content-Disposition: form-data;name="preImage"; filename="preImage.jpg"\r
Content-Type: application/octet-stream\r
Content-Transfer-Encoding: binary\r
\r
`,
            m = `\r
--${this._boundaryStr}--`,
            f = new yt.TextEncoder,
            w = f.encode(c),
            y = new Uint8Array(n),
            x = f.encode(d),
            S = new Uint8Array(r),
            R = f.encode(m),
            A = new Uint8Array(w.length + y.length + x.length + S.length + R.length),
            P = 0;
          A.set(w, P), P += w.length, A.set(y, P), P += y.length, A.set(x, P), P += x.length, A.set(S, P), P += S.length, A.set(R, P), P += R.length;
          const z = {
            "content-type": "multipart/form-data; boundary=" + this._boundaryStr,
            Authorization: this._token
          };
          return Ne(this._landmarkHost + Ys, "POST", null, z, A.buffer, this._timeout)
        }
        async getEmaRawData(t) {
          try {
            const i = await this._getEmaUrl(t);
            if (i.statusCode != 0) throw new Error("EMA request failed: " + i.msg);
            if (!i.result || !i.result.emaUrl || i.result.emaUrl.length == 0) throw new Error("EMA request succeeded, but result url is empty");
            const r = {
              "content-type": " "
            };
            return Ne(i.result.emaUrl, "GET", null, r, null)
          } catch (i) {
            throw i
          }
        }
        _isTokenExpired() {
          return new Date().getTime() > this._tokenExpireTime
        }
        _composeRequestParams(t, i, r, n) {
          let c = null;
          if (t.length == 1) {
            let d = this._prepareRequestData(t[0], i[0], r[0]);
            c = {
              appId: this._landmarkConfig.appId,
              apiKey: this._landmarkConfig.apiKey,
              clientSupplier: "wxmpp",
              clientVersion: E,
              timestamp: Date.now(),
              args: JSON.stringify(d),
              ...n
            }
          } else if (t.length >= 2) {
            let d = this._prepareRequestData(t[0], i[0], r[0]),
              m = this._prepareRequestData(t[1], i[1], r[1]);
            c = {
              appId: this._landmarkConfig.appId,
              apiKey: this._landmarkConfig.apiKey,
              clientSupplier: "wxmpp",
              clientVersion: E,
              timestamp: Date.now(),
              args: JSON.stringify(m),
              pres: JSON.stringify(d),
              ...n
            }
          }
          return c
        }
        _prepareRequestData(t, i, r) {
          let n = {
            schema: "1.0",
            cameraSize: t.cameraParams.getSize(),
            cameraParam: t.cameraParams.getParam(),
            cameraOrientation: `${t.cameraParams.cameraOrientation}`
          };
          console.log(i.geoLocation, '_prepareRequestData');
          if (i.acce && (n.acce = [`${i.acce.x}`, `${i.acce.y}`, `${i.acce.z}`]), i.geoLocation && (n.location = i.geoLocation, Object.keys(i.geoLocation).forEach(c => {
              n.location[c] = `${i.geoLocation[c]}`
            })), i.proximity) {
            const c = t.timestamp - i.proximity.timestamp;
            c < i.proximity.validTime && (n.prior.xyz = [`${i.proximity.x}`, `${i.proximity.y}`, `${i.proximity.z}`], n.prior.accuracy = `${i.proximity.accuracy}`, n.prior.delay = `${c}`, n.prior.is2d = i.proximity.is2d ? "1" : "0")
          }
          if (i.blockIds && i.blockIds.length > 0 && (n.blockid = i.blockIds), n.frameTimestamp = `${t.timestamp}`, t.cameraTransform) {
            let c = St(t.cameraTransformType, t.trackingStatus, t.cameraTransform);
            c && c.length > 0 && (n.cameraTransformParam = c, n.cameraTransformType = _t[t.cameraTransformType], n.recentFrames = r)
          }
          return n
        }
        async _getEmaUrl(t) {
          let i = {};
          return i.appId = this._landmarkConfig.appId, i.apiKey = this._landmarkConfig.apiKey, i.timestamp = `${Date.now()}`, i.signature = this._calcSignature(i), Ne(`${this._landmarkHost}/vps/arannotation/${t}`, "GET", i, null, null)
        }
        _validateConfig() {
          var t, i, r;
          if (!this._landmarkConfig) throw new Error("LandmarkLocalizer.initialize: Empty Service Config");
          if (!this._landmarkConfig.appId || this._landmarkConfig.appId.length == 0) throw new Error("LandmarkLocalizer.initialize: AppId is empty");
          if (!this._landmarkConfig.apiKey || this._landmarkConfig.apiKey.length == 0) throw new Error("LandmarkLocalizer.initialize: ApiKey is empty");
          if (!this._landmarkConfig.apiSecret || this._landmarkConfig.apiSecret.length == 0) throw new Error("LandmarkLocalizer.initialize: ApiSecret is empty");
          if (!this._landmarkConfig.serverAddress || this._landmarkConfig.serverAddress.length == 0) throw new Error("LandmarkLocalizer.initialize: ServerAddress is empty");
          this._trimConfig();
          const n = "[0-9a-f]",
            c = new RegExp(n, "ig");
          if (((t = this._landmarkConfig.appId.match(c)) == null ? void 0 : t.length) !== this._landmarkConfig.appId.length) throw new Error(`LandmarkLocalizer.initialize: AppId ${this._landmarkConfig.appId} is invalid`);
          if (((i = this._landmarkConfig.apiKey.match(c)) == null ? void 0 : i.length) !== this._landmarkConfig.apiKey.length) throw new Error(`LandmarkLocalizer.initialize: ApiKey ${this._landmarkConfig.apiKey} is invalid`);
          if (((r = this._landmarkConfig.apiSecret.match(c)) == null ? void 0 : r.length) !== this._landmarkConfig.apiSecret.length) throw new Error(`LandmarkLocalizer.initialize: ApiSecret ${this._landmarkConfig.apiSecret} is invalid`)
        }
        _trimConfig() {
          this._landmarkConfig.appId.trim(), this._landmarkConfig.apiKey.trim(), this._landmarkConfig.apiSecret.trim(), this._landmarkConfig.serverAddress.trim()
        }
        _queryUrlHost() {
          const t = "(https?://)([^:^/]*)(:\\d*)?(.*)?",
            i = new RegExp(t, "ig");
          let r = this._landmarkConfig.serverAddress;
          if (!i.test(r)) throw new Error(`Server Address ${r} is not valid.`);
          const n = r.split(i);
          return `${n[1]}${n[2]}${n[3]||""}`
        }
        _calcSignature(t) {
          console.log(t, '_calcSignature');
          let i = Object.keys(t).sort().map(r => `${r}${t[r]}`).concat(this._landmarkConfig.apiSecret).join("");
          return ai(i)
        }
      }
      var ze = (l => (l[l.Accelerometer = 1] = "Accelerometer", l[l.GeoLocation = 2] = "GeoLocation", l[l.Attitute = 4] = "Attitute", l))(ze || {});
      class as {
        constructor() {
          this._pauseFlag = !0, this._initFlag = !1, this._geoLocationInputMode = "Onsite", this._simulatorGeoLocation = null, this._onError = new V, this._blockLocalized = new V, this._updateCameraTransform = new V, this._onRequireImage = new V
        }
        get initFlag() {
          return this._initFlag
        }
        get serviceType() {
          return this._serviceType
        }
        get geoLocationInputMode() {
          return this._geoLocationInputMode
        }
        get errorEvent() {
          return this._onError.event
        }
        get blockLocalizedEvent() {
          return this._blockLocalized.event
        }
        get updateCameraTransformEvent() {
          return this._updateCameraTransform.event
        }
        get requireImageEvent() {
          return this._onRequireImage.event
        }
        initialize() {
          try {
            this.start()
          } catch (t) {
            throw new Error(t)
          }
          this._initFlag = !0
        }
        dispose() {
          var t;
          this.stop(), this._initFlag = !1, this._onError.dispose(), (t = this._onRequireImage) == null || t.dispose(), this._blockLocalized.dispose(), this._updateCameraTransform.dispose()
        }
      }
      const Mi = class {
        constructor(l) {
          this.element = l, this.next = Mi.Undefined, this.prev = Mi.Undefined
        }
      };
      let Dt = Mi;
      Dt.Undefined = new Mi(void 0);
      class Qs {
        constructor() {
          this._first = Dt.Undefined, this._last = Dt.Undefined, this._size = 0
        }
        get size() {
          return this._size
        }
        isEmpty() {
          return this._first === Dt.Undefined
        }
        clear() {
          let t = this._first;
          for (; t !== Dt.Undefined;) {
            const i = t.next;
            t.prev = Dt.Undefined, t.next = Dt.Undefined, t = i
          }
          this._first = Dt.Undefined, this._last = Dt.Undefined, this._size = 0
        }
        unshift(t) {
          return this._insert(t, !1)
        }
        push(t) {
          return this._insert(t, !0)
        }
        _insert(t, i) {
          const r = new Dt(t);
          if (this._first === Dt.Undefined) this._first = r, this._last = r;
          else if (i) {
            const c = this._last;
            this._last = r, r.prev = c, c.next = r
          } else {
            const c = this._first;
            this._first = r, r.next = c, c.prev = r
          }
          this._size += 1;
          let n = !1;
          return () => {
            n || (n = !0, this._remove(r))
          }
        }
        shift() {
          if (this._first !== Dt.Undefined) {
            const t = this._first.element;
            return this._remove(this._first), t
          }
        }
        pop() {
          if (this._last !== Dt.Undefined) {
            const t = this._last.element;
            return this._remove(this._last), t
          }
        }
        _remove(t) {
          if (t.prev !== Dt.Undefined && t.next !== Dt.Undefined) {
            const i = t.prev;
            i.next = t.next, t.next.prev = i
          } else t.prev === Dt.Undefined && t.next === Dt.Undefined ? (this._first = Dt.Undefined, this._last = Dt.Undefined) : t.next === Dt.Undefined ? (this._last = this._last.prev, this._last.next = Dt.Undefined) : t.prev === Dt.Undefined && (this._first = this._first.next, this._first.prev = Dt.Undefined);
          this._size -= 1
        }*[Symbol.iterator]() {
          let t = this._first;
          for (; t !== Dt.Undefined;) yield t.element, t = t.next
        }
      }
      class Si {
        update(t, i) {
          this._update(new kt().mul2(i.clone().getInverse(), t.clone().getInverse()))
        }
        _update(t) {
          this._TboTweenStart = this._TboInbetween ? this._TboInbetween : this._TboTweenEnd, this._TboTweenEnd = t, this._isTweening = this._TboTweenStart && this._TboTweenEnd && !Mr(this._TboTweenStart, this._TboTweenEnd), this._isTweenStarted = !1
        }
        getPose(t, i) {
          if (!this._TboTweenEnd) return null;
          if (this._isTweenStarted || (this._tweenStartTime = i, this._isTweenStarted = !0), this._isTweening) {
            const r = i - this._tweenStartTime,
              n = Math.min(1, r);
            this._TboInbetween = Sr(this._TboTweenStart, this._TboTweenEnd, n)
          } else this._TboInbetween = this._TboTweenEnd;
          return new kt().mul2(this._TboInbetween.clone(), t.clone()).getInverse()
        }
        jump() {
          this._isTweening = !1
        }
      }
      class Js extends Si {
        constructor() {
          super(...arguments), this._dataCache = [], this._preResult = null
        }
        request(t, i, r) {
          let n = {
            localTwc: {
              data: t.clone().transpose().array
            },
            mapTcw: {
              data: i.clone().transpose().array
            },
            timestamp: r
          };
          this._dataCache.push(n);
          let c = 0;
          for (; n.timestamp - this._dataCache[c].timestamp > 90;) c++;
          return c > 0 && (this._dataCache = this._dataCache.slice(c)), this._dataCache.length < 1 ? Promise.reject("poseFusion empty") : Hs(this._dataCache, d => {
            this._preResult && (d.result.status < this._preResult.status || d.result.timestamp < this._preResult.timestamp) || (this._preResult = d.result, this._update(new kt().set(d.result.transform.data).transpose()))
          })
        }
        update(t, i) {
          throw new Error("update not allowed in legacy mode")
        }
        getPose(t, i) {
          let r = super.getPose(t, i);
          return r && br(r), r
        }
        jump() {
          super.jump(), this._dataCache = []
        }
      }
      class rs {
        update(t, i) {
          this._Tbo = new kt().mul2(i.clone().getInverse(), t.clone().getInverse())
        }
        getPose(t) {
          return new kt().mul2(this._Tbo.clone(), t.clone()).getInverse()
        }
      }

      function br(l) {
        const t = l.data;
        let i = 1 / new Et(t[0], t[1], t[2]).magnitude();
        t[0] *= i, t[1] *= i, t[2] *= i, t[4] *= i, t[5] *= i, t[6] *= i, t[8] *= i, t[9] *= i, t[10] *= i, t[15] = 1
      }

      function Mr(l, t) {
        const i = l.decompose(),
          r = t.decompose(),
          n = i.rotation.getInverse().mul(r.rotation).data;
        let c = (n[0] + n[5] + n[10] + n[15] - 1.000001) / 2;
        c >= 1 && (c = 1), c <= -1 && (c = -1);
        const d = Math.acos(c) * 180 / Math.PI,
          m = {
            x: i.position.x - r.position.x,
            y: i.position.y - r.position.y,
            z: i.position.z - r.position.z
          };
        return Math.sqrt(m.x * m.x + m.y * m.y + m.z * m.z) > 5 || d > 90
      }

      function Sr(l, t, i) {
        const r = l.decompose(),
          n = t.decompose(),
          c = new qt().setFromMat4(l),
          d = new qt().setFromMat4(t),
          m = {
            x: r.position.x * (1 - i) + n.position.x * i,
            y: r.position.y * (1 - i) + n.position.y * i,
            z: r.position.z * (1 - i) + n.position.z * i
          },
          f = {
            x: r.scale.x * (1 - i) + n.scale.x * i,
            y: r.scale.y * (1 - i) + n.scale.y * i,
            z: r.scale.z * (1 - i) + n.scale.z * i
          },
          w = new qt().slerp(c, d, i);
        return new kt().setTRS(m, w, f)
      }
      class Zs {
        constructor() {
          this.lastFrameTs = 0
        }
        detect(t, i) {
          if (this.lastFrameTs === 0 || !this.lastVio) return this.lastFrameTs = i, this.lastVio = t, !1;
          const r = this.lastVio.getPosition(),
            n = t.getPosition(),
            c = Et.sub(r, n).magnitude(),
            d = i - this.lastFrameTs;
          if (d < 1e-7) return !1;
          let m = !1;
          return (c / d > 6 || c > 3) && (m = !0), this.lastFrameTs = i, this.lastVio = t.clone(), m
        }
        reset() {
          this.lastFrameTs = 0, this.lastVio = null
        }
      }
      class ns {
        constructor(t) {
          this._instances = null, this._instances = t
        }
        get blockInstances() {
          return this._instances
        }
      }
      class ta {
        constructor(t) {
          this.blockInstances = [], this.inputFrame = t.inputFrame, this.localizationStatus = t.localizerStatus, this.blockInstances = t.blockInstances, this.serverResponseDuration = t.serverResponseDuration, this.serverCalculationDuration = t.serverCalculationDuration, this.errorMessage = t.localizerStatus == Bt.UnknownError ? t.exceptionInfo : null, this.extraInfo = t.extraInfo
        }
      }
      let ni = 0;

      function Er() {
        ni < 1e4 ? ni += 1 : ni = 0
      }
      const Tr = 120;
      class ea extends as {
        constructor(t) {
          super(), this._recentFrames = [], this._serviceType = "block", this._previousIntervals = new Qs, this._onLegacyBlockService = new V, this._onGeoLocationStatus = new V, this._localizationResponse = new V, this._continuousLocalization = !0, this._enableStabilization = !0, this._localizationOnly = !1, this._localizeOnceCallback = null, this._blockLocalizer = new xr(t), this._vioJumpDetector = new Zs, this._requestFrameInterval = t.requestInterval, this._resetBuffer()
        }
        get localizationResponseEvent() {
          return this._localizationResponse.event
        }
        get geoLocationStatus() {
          return this._onGeoLocationStatus.event
        }
        get legacyBlockServiceEvent() {
          return this._onLegacyBlockService.event
        }
        dispose() {
          var t, i;
          super.dispose(), this._resetBuffer(), (t = this._accelerometer) == null || t.dispose(), (i = this._geoLocationProvider) == null || i.dispose(), this._onLegacyBlockService.dispose(), this._onGeoLocationStatus.dispose(), this._localizationResponse.dispose()
        }
        stop() {
          var t;
          this._pauseFlag = !0, Er(), (t = this._accelerometer) == null || t.stop(), this._geoLocationProvider && this._geoLocationProvider.stop(), this.reset()
        }
        reset() {
          this._arSessionId = null, this._currentBlockId = null, this._currentBlockName = null, this._resetBuffer(), this._resetPoseFusion(), this._vioJumpDetector.reset(), this._recentFrames = [], this._lastLocalizeTimeMs = 0
        }
        start() {
          const t = this._blockLocalizer.blockServiceHandler.versionTag;
          if (!t) throw new Error("Block service version invalid");
          if (t < ri.V6_And_Later && this._onLegacyBlockService.fire(), this._resetPoseFusion(), this._accelerometer) try {
            this._accelerometer.start()
          } catch (i) {
            throw new Error("Fail to start accelerometer: " + i.message)
          }
          if (this._geoLocationProvider) try {
            this._geoLocationInputMode == "Onsite" && (this._geoLocationProvider.start(), this._onGeoLocationStatus.fire(!0))
          } catch (i) {
            throw this._onGeoLocationStatus.fire(!1), this._geoLocationInputMode = "Simulator", new Error("Fail to start GPS: " + i.message)
          } else this._onGeoLocationStatus.fire(!1), this._geoLocationInputMode = "Simulator";
          this._pauseFlag = !1
        }
        onFrameInput(t) {
          if (this._pauseFlag == !0) return;
          !this._localizationOnly && !t.cameraTransform && (et.log("Localization-only due to no camera transform"), this._localizationOnly = !0), this._localizationOnly && t.cameraTransform && (t.cameraTransform = null), this._checkRequireImageCondition() && this._onRequireImage.fire();
          const i = this._accelerometer.current,
            r = this._geoLocationInputMode == "Onsite" ? this._geoLocationProvider.current : this._simulatorGeoLocation;
          if (t.imageString && t.imageString.length > 0 || t.imageBuffer && t.imageBuffer.byteLength > 0) {
            const w = new b(i, r, this._proximity, this._priorBlockIds);
            et.log("Frame data's tracking mode is: ", _t[t.cameraTransformType]), this._frameDataBuffer.push(t), this._deviceAuxInfoBuffer.push(w), this._recentFrameBuffer.push(this._recentFrames);
            const y = this._blockLocalizer.blockServiceHandler.requestFrameCount,
              x = ni;
            if (this._frameDataBuffer.length >= y) {
              const S = this._frameDataBuffer,
                R = this._deviceAuxInfoBuffer,
                A = this._recentFrameBuffer;
              this._resetBuffer(), this._blockLocalizer.resolve(S, this._message, R, A, this._arSessionId).then(P => {
                if (P instanceof Error) {
                  this._onError.fire(P), this._localizeOnceCallback && (this._localizeOnceCallback(null), this._localizeOnceCallback = null);
                  return
                }
                const z = R[R.length - 1];
                if (this._localizeOnceCallback && (this._localizeOnceCallback(this._makeLocalizationResponse(P, z)), this._localizeOnceCallback = null), x == ni) {
                  if (P.arSessionId && (this._arSessionId = P.arSessionId), P.localizerStatus != Bt.Found) {
                    this._handleLocalizationResult(P, z);
                    return
                  }
                  if (P.blockInstances && (this._currentBlockId = P.blockInstances[0].blockId, this._currentBlockName = P.blockInstances[0].name), this._localizationOnly) {
                    this._handleLocalizationOnly(P, z);
                    return
                  }
                  if (this._poseHolder.update(P.inputFrame.cameraTransform, P.blockInstances[0].pose), this._poseFusion) {
                    if (this._poseFusion.update(P.inputFrame.cameraTransform, P.blockInstances[0].pose), bt.getInstance().isRecordingData) {
                      const U = this._poseFusion.getPose(P.inputFrame.cameraTransform, P.inputFrame.timestamp).transpose().array.map(Y => `${Y}`);
                      bt.getInstance().recordNativePose({
                        pose: U,
                        frameTimestamp: `${P.inputFrame.timestamp}`
                      })
                    }
                    this._handleLocalizationResult(P, z)
                  } else this._poseFusionLegacy && this._poseFusionLegacy.request(P.inputFrame.cameraTransform, P.blockInstances[0].pose, P.inputFrame.timestamp).then(() => {
                    if (bt.getInstance().isRecordingData) {
                      const U = this._poseFusionLegacy.getPose(P.inputFrame.cameraTransform, P.inputFrame.timestamp).transpose().array.map(Y => `${Y}`);
                      bt.getInstance().recordNativePose({
                        pose: U,
                        timestamp: `${P.inputFrame.timestamp}`
                      })
                    }
                    this._handleLocalizationResult(P, z)
                  })
                }
              }), this._recentFrames = []
            }
          }
          if (this._localizationOnly) return;
          this._vioJumpDetector.detect(t.cameraTransform, t.timestamp) && (this._poseFusion ? this._poseFusion.jump() : this._poseFusionLegacy && this._poseFusionLegacy.jump());
          let n = t.cameraParams.getImageOrientation();
          const c = this._blockLocalizer.blockServiceHandler.requestTimeout;
          if (this._blockLocalizer.blockServiceHandler.versionTag >= ri.V6_And_Later) {
            const w = pt(t.cameraTransformType, t.timestamp, t.trackingStatus, t.cameraTransform, i, n);
            w && w.length > 0 && this._updateRecentFrames(w, c)
          }
          let d = null;
          if (this._enableStabilization ? this._poseFusion ? d = this._poseFusion.getPose(t.cameraTransform, t.timestamp) : this._poseFusionLegacy && (d = this._poseFusionLegacy.getPose(t.cameraTransform, t.timestamp)) : d = this._poseHolder.getPose(t.cameraTransform), !d) {
            const w = new ns(null);
            this._handleBlockTrackerResult(w, null);
            return
          }
          let m = [new J(this._currentBlockId, this._currentBlockName, d)];
          const f = new ns(m);
          this._handleBlockTrackerResult(f, new kt().setFromEulerAngles(0, 0, -n))
        }
        setUserMessage(t) {
          this._message = t
        }
        setGeoLocationInput(t, i) {
          if (t != "Onsite" && t != "Simulator") throw new Error("InputMode is Invalid: " + t);
          if (this._geoLocationInputMode = t, t == "Simulator") {
            if (i && (!i.longitude || !i.latitude)) throw new Error("Invalid Simulator GPS: " + JSON.stringify(i));
            this._simulatorGeoLocation = i, this._geoLocationProvider.stop()
          } else try {
            this._geoLocationProvider.start()
          } catch (r) {
            throw this._onGeoLocationStatus.fire(!1), this._geoLocationInputMode = "Simulator", this._simulatorGeoLocation = null, new Error("Fail to start GPS: " + r.message)
          }
        }
        setPriorBlockId(t) {
          if (!t) {
            this._priorBlockIds = null;
            return
          }
          this._priorBlockIds = [t]
        }
        toggleContinuousLocalization(t) {
          this._lastLocalizeTimeMs = null, this._previousIntervals.clear(), this._continuousLocalization = t
        }
        toggleLocalizationOnly(t) {
          t && (this._resetPoseFusion(), this._vioJumpDetector.reset(), this._recentFrames = []), this._localizationOnly = t
        }
        toggleStablize(t) {
          this._enableStabilization = t
        }
        async localizeOnce() {
          return this._onRequireImage.fire(), new Promise(t => {
            this._localizeOnceCallback = t
          })
        }
        _resetBuffer() {
          this._frameDataBuffer = [], this._deviceAuxInfoBuffer = [], this._recentFrameBuffer = []
        }
        _updateRecentFrames(t, i) {
          if (!t || t.length == 0) return;
          const r = Math.min(4 * this._requestFrameInterval, i);
          let n = 0;
          for (let d = 0; d < this._recentFrames.length && (Number(t.split(",")[0]) - Number(this._recentFrames[d].split(",")[0])) * 1e3 >= r; ++d) ++n;
          n > 0 && this._recentFrames.splice(0, n);
          const c = this._recentFrames.length - Tr;
          c > 0 && this._recentFrames.splice(0, c), this._recentFrames.push(t)
        }
        _handleLocalizationOnly(t, i) {
          this._handleLocalizationResult(t, i);
          const r = t.inputFrame.cameraParams.getImageOrientation(),
            n = new kt().setFromEulerAngles(0, 0, -r),
            c = new kt().mul2(t.blockInstances[0].pose.clone().getInverse(), n.clone().getInverse()).array;
          this._updateCameraTransform.fire(c)
        }
        _handleLocalizationResult(t, i) {
          t.localizerStatus == Bt.Found && this._blockLocalized.fire(t.blockInstances[0]);
          const r = this._makeLocalizationResponse(t, i);
          this._localizationResponse.fire(r)
        }
        _handleBlockTrackerResult(t, i) {
          if (t.blockInstances == null) return;
          const r = new kt().mul2(t.blockInstances[0].pose.clone().getInverse(), i.clone().getInverse()).array;
          this._updateCameraTransform.fire(r)
        }
        _makeLocalizationResponse(t, i) {
          const r = this._blockLocalizer.blockServiceHandler;
          let n = new ta(t);
          return n.acce = i.acce, n.geoLocation = i.geoLocation, n.appId = r.config.appId, n.requestTimestamp = this._lastLocalizeTimeMs, n.requestInterval = r.requestInterval, n.server = r.clsHost, n
        }
        _checkRequireImageCondition() {
          if (!this._continuousLocalization) return !1;
          const t = new Date().getTime();
          if (this._lastLocalizeTimeMs == null) return this._lastLocalizeTimeMs = t, !0;
          this._syncRequestInterval();
          const i = t - this._lastLocalizeTimeMs;
          if (i < this._requestFrameInterval / 2) return !1;
          let r = 0,
            n = 0;
          for (const c of this._previousIntervals) r += (c - this._requestFrameInterval) * Math.exp(-n * .5), n += 1;
          return i < this._requestFrameInterval - r ? !1 : (this._previousIntervals.unshift(i), this._previousIntervals.size > 10 && this._previousIntervals.pop(), this._lastLocalizeTimeMs = t, !0)
        }
        _syncRequestInterval() {
          let t = this._blockLocalizer.blockServiceHandler.requestInterval;
          this._blockLocalizer.blockServiceHandler.isUsingGstrat === !0 && (t = Math.min(t / 2, 500), t = Math.max(t, 300)), this._requestFrameInterval = t
        }
        _resetPoseFusion() {
          const t = this._blockLocalizer.blockServiceHandler.versionTag;
          !t || (this._poseHolder = new rs, this._poseFusion = null, this._poseFusionLegacy = null, t >= ri.V6_And_Later ? this._poseFusion = new Si : this._poseFusionLegacy = new Js)
        }
      }
      class ia {
        constructor() {
          this.blockInstances = []
        }
      }
      class Rr {
        get landmarkServiceHandler() {
          return this._landmarkServiceHandler
        }
        constructor(t) {
          this._landmarkServiceHandler = t
        }
        geoFilter(t) {
          const i = {
            longitude: t.longitude,
            latitude: t.latitude,
            altitude: t.altitude
          };
          return this._landmarkServiceHandler.requestGeoFilter(i)
        }
        resolve(t, i, r, n, c, d) {
          return new Promise((m, f) => {
            t.length == 0 && f(new Error("Request sequence is empty when resolving in landmark localizer"));
            const w = this._landmarkServiceHandler.requestFrameCount;
            t.length != w && f(new Error(`Frame request sequences size should be ${w}, but it is currently ${t.length}`)), r.length != w && f(new Error(`DeviceAuxiliaryInfo request sequences size should be ${w}, but it is currently ${r.length}`)), n.length != w && f(new Error(`RecentFrameBuffer request sequences size should be ${w}, but it is currently ${n.length}`)), c || f(new Error("Empty spotVersionId when resolving in landmark localizer"));
            for (const S of t)(!S.imageString || S.imageString.length == 0) && (!S.imageBuffer || S.imageBuffer.byteLength == 0) && f(new Error("Empty Image when resolving in landmark localizer"));
            const y = new Date().getTime();
            let x = {};
            if (i) try {
              x = JSON.parse(i)
            } catch {
              f(new Error("Fail to parse user message in localizer"))
            }
            x.startTime = y, x.spotVersionId = c, d != null && (x.arSessionId = d), this._landmarkRequest(t, r, n, x).then(S => {
              if (S instanceof Error && f(S), bt.getInstance().isRecordingData) {
                let P = S;
                P.frameTimestamp = t[t.length - 1].timestamp, P.appid = this._landmarkServiceHandler.config.appId, bt.getInstance().recordClsResponse(P)
              }
              const R = new ia;
              R.inputFrame = t[t.length - 1], S.arSessionId && (R.arSessionId = S.arSessionId), S.spotVersionId && (R.spotVersionId = S.spotVersionId), R.extraInfo = S.extraInfo, R.exceptionInfo = S.msg;
              const A = new Date().getTime();
              R.serverResponseDuration = A - y, R.serverCalculationDuration = S.duration, S.statusCode != 0 ? S.statusCode == 17 ? R.localizerStatus = Bt.NotFound : S.statusCode == 21 ? R.localizerStatus = Bt.QpsLimitExceeded : S.statusCode == 100017 ? R.localizerStatus = Bt.WakingUp : R.localizerStatus = Bt.UnknownError : (R.localizerStatus = Bt.Found, S.result && R.blockInstances.push(J.fromLandmarkLocalizationResult(S.result[0]))), m(R)
            })
          })
        }
        _landmarkRequest(t, i, r, n) {
          const c = this._landmarkServiceHandler.composeRequestParams(t, i, r, n);
          if (bt.getInstance().isRecordingData)
            if (t.length == 1) t[0].imageString && t[0].imageString.length > 0 ? bt.getInstance().recordRequestArgs({
              ...JSON.parse(c.args),
              base64: t[0].imageString
            }) : t[0].imageBuffer && t[0].imageBuffer.byteLength > 0 ? bt.getInstance().recordRequestArgs({
              ...JSON.parse(c.args),
              base64: Oe(t[0].imageBuffer)
            }) : bt.getInstance().recordRequestArgs({
              ...JSON.parse(c.args)
            });
            else {
              let d = null,
                m = null;
              t[0].imageString && t[0].imageString.length > 0 ? d = t[0].imageString : t[0].imageBuffer && t[0].imageBuffer.byteLength > 0 && (d = Oe(t[0].imageBuffer)), t[1].imageString && t[1].imageString.length > 0 ? m = t[1].imageString : t[1].imageBuffer && t[1].imageBuffer.byteLength > 0 && (m = Oe(t[1].imageBuffer)), d && d.length > 0 ? bt.getInstance().recordRequestArgs({
                ...JSON.parse(c.pres),
                base64: d
              }) : bt.getInstance().recordRequestArgs({
                ...JSON.parse(c.pres)
              }), m && m.length > 0 ? bt.getInstance().recordRequestArgs({
                ...JSON.parse(c.args),
                base64: m
              }) : bt.getInstance().recordRequestArgs({
                ...JSON.parse(c.args)
              })
            } if (t.length <= 1) {
            if (t[0].imageBuffer && t[0].imageBuffer.byteLength > 0) return this._landmarkServiceHandler.requestServiceSingleImage(c, t[0].imageBuffer, !1);
            if (t[0].imageString && t[0].imageString.length > 0) return this._landmarkServiceHandler.requestServiceSingleImage(c, t[0].imageString, !0);
            et.log("No image buffer nor string at landmark cls request")
          }
          return this._landmarkServiceHandler.requestService(c, t)
        }
      }
      class os {
        constructor(t) {
          this._instances = null, this._instances = t
        }
        get blockInstances() {
          return this._instances
        }
      }
      class sa {
        constructor(t) {
          this.blockInstances = [], this.inputFrame = t.inputFrame, this.localizationStatus = t.localizerStatus, this.blockInstances = t.blockInstances, this.serverResponseDuration = t.serverResponseDuration, this.serverCalculationDuration = t.serverCalculationDuration, this.errorMessage = t.localizerStatus == Bt.UnknownError ? t.exceptionInfo : null, this.extraInfo = t.extraInfo
        }
      }
      let qe = 0;

      function Ir() {
        qe < 1e4 ? qe += 1 : qe = 0
      }
      const Cr = 120;
      class aa extends as {
        constructor(t) {
          super(), this._recentFrames = [], this._serviceType = "landmark", this._previousIntervals = new Qs, this._geoFilterIntervalMs = 3e4, this._localizationResponse = new V, this._continuousLocalization = !0, this._enableStabilization = !0, this._localizationOnly = !1, this._localizeOnceCallback = null, this._landmarkLocalizer = new Rr(t), this._vioJumpDetector = new Zs, this._requestFrameInterval = t.requestInterval, this._resetBuffer()
        }
        get localizationResponseEvent() {
          return this._localizationResponse.event
        }
        dispose() {
          var t, i;
          super.dispose(), this._resetBuffer(), (t = this._accelerometer) == null || t.dispose(), (i = this._geoLocationProvider) == null || i.dispose(), this._localizationResponse.dispose()
        }
        stop() {
          var t, i;
          this._pauseFlag = !0, Ir(), (t = this._accelerometer) == null || t.stop(), (i = this._geoLocationProvider) == null || i.stop(), this.reset()
        }
        start() {
          if (this._resetPoseFusion(), this._accelerometer) try {
            this._accelerometer.start()
          } catch (t) {
            throw new Error("Fail to start accelerometer: " + t.message)
          }
          if (this._geoLocationProvider) try {
            this._geoLocationInputMode == "Onsite" && this._geoLocationProvider.start()
          } catch (t) {
            throw this._geoLocationInputMode = "Simulator", new Error("Fail to start GPS: " + t.message)
          } else this._geoLocationInputMode = "Simulator";
          if (this._geoLocationInputMode == "Simulator" && (!this._simulatorGeoLocation || !this._simulatorGeoLocation.latitude || !this._simulatorGeoLocation.longitude)) throw new Error("Geo Location Input mode is now [Simulator] for landmark tracker; But the simulator GPS is invalid: " + JSON.stringify(this._simulatorGeoLocation));
          this._pauseFlag = !1
        }
        onFrameInput(t) {
          if (this._pauseFlag == !0) return;
          this._localizationOnly && !t.cameraTransform && (this._localizationOnly = !0), this._localizationOnly && t.cameraTransform && (t.cameraTransform = null);
          const i = this._accelerometer.current,
            r = this._geoLocationInputMode == "Onsite" ? this._geoLocationProvider.current : this._simulatorGeoLocation;
          if (this._checkGeoFilterCondition()) {
            const y = qe;
            this._landmarkLocalizer.geoFilter(r).then(x => {
              if (y == qe) {
                if (x instanceof Error) {
                  this._onError.fire(x);
                  return
                }
                if (x.statusCode != 0 || !x.result) {
                  this._onError.fire(new Error(x.msg));
                  return
                }
                if (x.result.length == 0) {
                  const S = `Landmark filter empty SpotVersion id for GPS: ${r.latitude}, ${r.longitude}, ${r.altitude}`;
                  et.log(S), this._onError.fire(new Error(S));
                  return
                }
                this._spotVersionId = x.result, et.log("Landmark SpotVersion id: ", this._spotVersionId)
              }
            })
          }
          if (this._checkRequireImageCondition() && this._onRequireImage.fire(), t.imageString && t.imageString.length > 0 || t.imageBuffer && t.imageBuffer.byteLength > 0) {
            const y = new b(i, r, this._proximity, this._priorBlockIds);
            et.log("Frame data's tracking mode is: ", _t[t.cameraTransformType]), this._frameDataBuffer.push(t), this._deviceAuxInfoBuffer.push(y), this._recentFrameBuffer.push(this._recentFrames);
            const x = this._landmarkLocalizer.landmarkServiceHandler.requestFrameCount,
              S = qe;
            if (this._frameDataBuffer.length >= x) {
              const R = this._frameDataBuffer,
                A = this._deviceAuxInfoBuffer,
                P = this._recentFrameBuffer;
              this._resetBuffer(), this._landmarkLocalizer.resolve(R, this._message, A, P, this._spotVersionId, this._arSessionId).then(z => {
                if (z instanceof Error) {
                  this._onError.fire(z), this._localizeOnceCallback && (this._localizeOnceCallback(null), this._localizeOnceCallback = null);
                  return
                }
                const U = y;
                if (this._localizeOnceCallback && (this._localizeOnceCallback(this._makeLocalizationResponse(z, U)), this._localizeOnceCallback = null), S == qe) {
                  if (z.arSessionId && (this._arSessionId = z.arSessionId), z.localizerStatus != Bt.Found) {
                    this._handleLocalizationResult(z, U);
                    return
                  }
                  if (z.blockInstances && (this._currentBlockId = z.blockInstances[0].blockId, this._currentBlockName = z.blockInstances[0].name), this._localizationOnly) {
                    this._handleLocalizationOnly(z, U);
                    return
                  }
                  if (this._poseHolder.update(z.inputFrame.cameraTransform, z.blockInstances[0].pose), this._poseFusion) {
                    if (this._poseFusion.update(z.inputFrame.cameraTransform, z.blockInstances[0].pose), bt.getInstance().isRecordingData) {
                      const Y = this._poseFusion.getPose(z.inputFrame.cameraTransform, z.inputFrame.timestamp).transpose().array.map(mt => `${mt}`);
                      bt.getInstance().recordNativePose({
                        pose: Y,
                        frameTimestamp: `${z.inputFrame.timestamp}`
                      })
                    }
                    this._handleLocalizationResult(z, U)
                  }
                }
              }), this._recentFrames = []
            }
          }
          if (this._localizationOnly) return;
          this._vioJumpDetector.detect(t.cameraTransform, t.timestamp) && this._poseFusion && this._poseFusion.jump();
          let n = t.cameraParams.getImageOrientation();
          const c = this._landmarkLocalizer.landmarkServiceHandler.requestTimeout,
            d = pt(t.cameraTransformType, t.timestamp, t.trackingStatus, t.cameraTransform, i, n);
          d && d.length > 0 && this._updateRecentFrames(d, c);
          let m = null;
          if (this._enableStabilization ? this._poseFusion && (m = this._poseFusion.getPose(t.cameraTransform, t.timestamp)) : m = this._poseHolder.getPose(t.cameraTransform), !m) {
            const y = new os(null);
            this._handleLandmarkTrackerResult(y, null);
            return
          }
          let f = [new J(this._currentBlockId, this._currentBlockName, m)];
          const w = new os(f);
          this._handleLandmarkTrackerResult(w, new kt().setFromEulerAngles(0, 0, -n))
        }
        setUserMessage(t) {
          this._message = t
        }
        setGeoLocationInput(t, i) {
          if (t != "Onsite" && t != "Simulator") throw new Error("InputMode is Invalid: " + t);
          if (this._geoLocationInputMode = t, t == "Simulator") {
            if (!i || !i.longitude || !i.latitude) throw new Error("Trying to use empty or invalid gps location for Simulator Input in Landmark Tracker: " + JSON.stringify(i));
            this._simulatorGeoLocation = i, this._geoLocationProvider.stop()
          } else try {
            this._geoLocationProvider.start()
          } catch (r) {
            throw this._geoLocationInputMode = "Simulator", this._simulatorGeoLocation = null, new Error("Fail to start GPS in landmark: " + r.message)
          }
        }
        setPriorBlockId(t) {
          if (!t) {
            this._priorBlockIds = null;
            return
          }
          this._priorBlockIds = [t]
        }
        toggleContinuousLocalization(t) {
          this._lastLocalizeTimeMs = null, this._previousIntervals.clear(), this._continuousLocalization = t
        }
        toggleLocalizationOnly(t) {
          t && (this._resetPoseFusion(), this._vioJumpDetector.reset(), this._recentFrames = []), this._localizationOnly = t
        }
        toggleStablize(t) {
          this._enableStabilization = t
        }
        localizeOnce() {
          const t = new Date().getTime();
          if (this._lastLocalizeTimeMs == null) this._lastLocalizeTimeMs = t;
          else {
            let i = this._landmarkLocalizer.landmarkServiceHandler.requestInterval;
            const r = t - this._lastLocalizeTimeMs;
            if (r < i) throw new Error("localizeOnce called too frequently, interval: " + r.toString())
          }
          return this._lastLocalizeTimeMs = t, this._onRequireImage.fire(), new Promise(i => {
            this._localizeOnceCallback = i
          })
        }
        reset() {
          this._arSessionId = null, this._spotVersionId = null, this._currentBlockId = null, this._currentBlockName = null, this._resetBuffer(), this._resetPoseFusion(), this._vioJumpDetector.reset(), this._recentFrames = [], this._lastLocalizeTimeMs = 0
        }
        _resetBuffer() {
          this._frameDataBuffer = [], this._deviceAuxInfoBuffer = [], this._recentFrameBuffer = []
        }
        _updateRecentFrames(t, i) {
          if (!t || t.length == 0) return;
          const r = Math.min(4 * this._requestFrameInterval, i);
          let n = 0;
          for (let d = 0; d < this._recentFrames.length && (Number(t.split(",")[0]) - Number(this._recentFrames[d].split(",")[0])) * 1e3 >= r; ++d) ++n;
          n > 0 && this._recentFrames.splice(0, n);
          const c = this._recentFrames.length - Cr;
          c > 0 && this._recentFrames.splice(0, c), this._recentFrames.push(t)
        }
        _handleLocalizationOnly(t, i) {
          this._handleLocalizationResult(t, i);
          const r = t.inputFrame.cameraParams.getImageOrientation(),
            n = new kt().setFromEulerAngles(0, 0, -r),
            c = new kt().mul2(t.blockInstances[0].pose.clone().getInverse(), n.clone().getInverse()).array;
          this._updateCameraTransform.fire(c)
        }
        _handleLocalizationResult(t, i) {
          t.localizerStatus == Bt.Found && this._blockLocalized.fire(t.blockInstances[0]);
          const r = this._makeLocalizationResponse(t, i);
          this._localizationResponse.fire(r)
        }
        _handleLandmarkTrackerResult(t, i) {
          if (t.blockInstances == null) return;
          const r = new kt().mul2(t.blockInstances[0].pose.clone().getInverse(), i.clone().getInverse()).array;
          this._updateCameraTransform.fire(r)
        }
        _makeLocalizationResponse(t, i) {
          const r = this._landmarkLocalizer.landmarkServiceHandler;
          let n = new sa(t);
          return n.acce = i.acce, n.geoLocation = i.geoLocation, n.appId = r.config.appId, n.spotVersionId = this._spotVersionId, n.requestTimestamp = this._lastLocalizeTimeMs, n.requestInterval = r.requestInterval, n.server = r.landmarkHost, n
        }
        _checkGeoFilterCondition() {
          if (this._geoLocationInputMode == "Onsite" && (this._geoLocationProvider.current == null || this._geoLocationProvider.current == null)) return !1;
          if (this._geoLocationInputMode == "Simulator" && !this._simulatorGeoLocation) return et.log("Session running in [Simulator] while geo location not set"), !1;
          const t = new Date().getTime();
          return !this._lastGeoFilterTimeMs || t - this._lastGeoFilterTimeMs > this._geoFilterIntervalMs ? (this._lastGeoFilterTimeMs = t, !0) : !1
        }
        _checkRequireImageCondition() {
          if (!this._spotVersionId || this._spotVersionId.length == 0 || !this._continuousLocalization) return !1;
          const t = new Date().getTime();
          if (this._lastLocalizeTimeMs == null) return this._lastLocalizeTimeMs = t, !0;
          this._syncRequestInterval();
          const i = t - this._lastLocalizeTimeMs;
          if (i < this._requestFrameInterval / 2) return !1;
          let r = 0,
            n = 0;
          for (const c of this._previousIntervals) r += (c - this._requestFrameInterval) * Math.exp(-n * .5), n += 1;
          return i < this._requestFrameInterval - r ? !1 : (this._previousIntervals.unshift(i), this._previousIntervals.size > 10 && this._previousIntervals.pop(), this._lastLocalizeTimeMs = t, !0)
        }
        _syncRequestInterval() {
          let t = this._landmarkLocalizer.landmarkServiceHandler.requestInterval;
          this._landmarkLocalizer.landmarkServiceHandler.isUsingGstrat === !0 && (t = Math.min(t / 2, 500), t = Math.max(t, 300)), this._requestFrameInterval = t
        }
        _resetPoseFusion() {
          this._poseHolder = new rs, this._poseFusion = null, this._poseFusion = new Si
        }
      }
      class ra {
        constructor() {
          this._handler = null, this._externalControlFlag = !1, this._onAcceUpdate = new V
        }
        get current() {
          return this._currentAcce
        }
        get onAcceUpdate() {
          return this._onAcceUpdate.event
        }
      }
      class na {
        constructor() {
          this._handler = null, this._externalControlFlag = !1, this._onAttituteUpdate = new V
        }
        get onAttituteUpdate() {
          return this._onAttituteUpdate.event
        }
      }
      class Xe {
        get trackingStatus() {
          return this._trackingStatus
        }
        get cameraTransformType() {
          return this._cameraTransformType
        }
        get cameraParams() {
          return this._cameraParms
        }
        get timestamp() {
          return this._timestamp
        }
        get cameraTransform() {
          return this._cameraTransform
        }
        get imageString() {
          return this._imageString
        }
        get imageBuffer() {
          return this._imageBuffer
        }
        set cameraTransform(t) {
          this._cameraTransform = t
        }
        constructor(t, i, r, n, c, d = null, m = null) {
          this._trackingStatus = t, this._cameraTransformType = i, this._cameraParms = r, this._timestamp = n, this._cameraTransform = c, this._imageString = d, this._imageBuffer = m, m && m.byteLength > 0 && (this._imageString = null)
        }
      }
      class hs {
        constructor() {
          this._onFrameInput = new V, this._initFlag = !1, this._imageFlag = !1
        }
        get initFlag() {
          return this._initFlag
        }
        get onFrameInput() {
          return this._onFrameInput.event
        }
        onRequireImage() {
          this._imageFlag = !0
        }
      }
      class oa {
        get frameSource() {
          return this._frameSource
        }
        get tracker() {
          return this._tracker
        }
        get isReady() {
          return this._tracker && this._frameSource && this._tracker.initFlag && this._frameSource.initFlag
        }
        assemble(t, i) {
          this._frameSource = t, this._tracker = i, this._assemble()
        }
        dispose() {
          this._frameSource != null && this._frameSource.dispose(), this._tracker != null && this._tracker.dispose()
        }
        initialize() {
          try {
            this._frameSource.initFlag || this._frameSource.initialize(), this._tracker.initFlag || this._tracker.initialize()
          } catch (t) {
            throw t
          }
        }
        async onFrameUpdate() {
          try {
            this._frameSource.onFrameUpdate()
          } catch (t) {
            throw t
          }
        }
        _assemble() {
          H(this._frameSource.onFrameInput, t => this._tracker.onFrameInput(t)), H(this._tracker.requireImageEvent, () => this._frameSource.onRequireImage())
        }
      }
      class ls {
        constructor(t, i) {
          this.rotation = t, this.timestamp = i
        }
        static copyConstruct(t) {
          return new ls(t.rotation.clone(), t.timestamp)
        }
      }
      const Pr = 8,
        Fr = 200,
        Dr = 20;
      class zr {
        constructor() {
          this._previousRotationPose = new kt, this._rotationBuffer = []
        }
        getRotationPose(t) {
          let i = 0;
          for (let n = 0; n < this._rotationBuffer.length - 1 && t - this._rotationBuffer[n].timestamp >= Dr * 2; ++n) ++i;
          if (i > 0 && this._rotationBuffer.splice(0, i), this._rotationBuffer.length == 0) return this._previousRotationPose;
          const r = this._rotationBuffer[this._rotationBuffer.length - 1];
          return t - r.timestamp > Fr ? this._previousRotationPose : (this._previousRotationPose = r.rotation, r.rotation)
        }
        insertData(t) {
          const i = new qt;
          i.set(t.x, t.y, t.z, t.w);
          const r = new kt().setTRS({
              x: 0,
              y: 0,
              z: 0
            }, i, {
              x: 1,
              y: 1,
              z: 1
            }),
            n = t.timestamp ? t.timestamp : t.systemTimestamp;
          this._rotationBuffer.push({
            timestamp: n,
            rotation: r
          });
          const c = this._rotationBuffer.length - Pr;
          c > 0 && this._rotationBuffer.splice(0, c)
        }
      }
      let be = null;
      class Lr {
        constructor(t, i, r) {
          this.displayTransform270 = new Float32Array([0, 1, 0, -1, 0, 0, 0, 0, 1]), this._glCanvas = null, this._glContext = null, this._glProgram = null, this._ext = null, this._vao = null, this._dt = null, this._yTexture = null, this._uvTexture = null, this._legacyFlag = !1, this._legacyFlag = r, this._createCanvas(t, i, r), this._glCanvas = be, this._glContext = this._glCanvas.getContext("webgl"), this._initShader()
        }
        dispose() {
          const t = this._glContext;
          t.deleteProgram(this._glProgram), t.deleteTexture(this._yTexture), t.deleteTexture(this._uvTexture), t.deleteBuffer(this._vao.posBuffer), t.deleteBuffer(this._vao.texcoordBuffer), this._ext.deleteVertexArrayOES(this._vao), this._glProgram = null, this._glContext = null, this._glCanvas = null, this._ext = null, this._vao = null, this._yTexture = null, this._uvTexture = null
        }
        _initShader() {
          const t = this._glContext;
          let i = null;
          this._legacyFlag ? i = `  attribute vec2 a_position;
                    attribute vec2 a_texCoord;
                    uniform mat3 displayTransform;
                    varying vec2 v_texCoord;
                    void main() {
                        vec3 p = displayTransform * vec3(a_position, 0);
                        gl_Position = vec4(p, 1);
                        v_texCoord = a_texCoord;
                    }` : i = `attribute vec2 a_position;
                    attribute vec2 a_texCoord;
                    uniform mat3 displayTransform;
                    varying vec2 v_texCoord;
                    void main() {
                        gl_Position = vec4(a_position, 0, 1);
                        v_texCoord = a_texCoord;
                    }`;
          const r = `precision highp float;
                    uniform sampler2D y_texture;
                    uniform sampler2D uv_texture;
                    varying vec2 v_texCoord;
                    void main() {
                        vec4 y_color = texture2D(y_texture, v_texCoord);
                        vec4 uv_color = texture2D(uv_texture, v_texCoord);

                        float Y, U, V;
                        float R ,G, B;
                        Y = y_color.r;
                        U = uv_color.r - 0.5;
                        V = uv_color.a - 0.5;

                        R = Y + 1.402 * V;
                        G = Y - 0.344 * U - 0.714 * V;
                        B = Y + 1.772 * U;

                        gl_FragColor = vec4(R, G, B, 1.0);
                    }`,
            n = t.createShader(t.VERTEX_SHADER);
          t.shaderSource(n, i), t.compileShader(n);
          const c = t.createShader(t.FRAGMENT_SHADER);
          t.shaderSource(c, r), t.compileShader(c), this._glProgram = t.createProgram(), t.attachShader(this._glProgram, n), t.attachShader(this._glProgram, c), t.deleteShader(n), t.deleteShader(c), t.linkProgram(this._glProgram), t.useProgram(this._glProgram);
          const d = t.getUniformLocation(this._glProgram, "y_texture");
          t.uniform1i(d, 0);
          const m = t.getUniformLocation(this._glProgram, "uv_texture");
          t.uniform1i(m, 1), this._legacyFlag && (this._dt = t.getUniformLocation(this._glProgram, "displayTransform")), this._ext = t.getExtension("OES_vertex_array_object"), this._vao = this._ext.createVertexArrayOES(), this._ext.bindVertexArrayOES(this._vao);
          const f = t.getAttribLocation(this._glProgram, "a_position"),
            w = t.createBuffer();
          t.bindBuffer(t.ARRAY_BUFFER, w), t.bufferData(t.ARRAY_BUFFER, new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]), t.STATIC_DRAW), t.vertexAttribPointer(f, 2, t.FLOAT, !1, 0, 0), t.enableVertexAttribArray(f), this._vao.posBuffer = w;
          const y = t.getAttribLocation(this._glProgram, "a_texCoord"),
            x = t.createBuffer();
          t.bindBuffer(t.ARRAY_BUFFER, x), this._legacyFlag ? t.bufferData(t.ARRAY_BUFFER, new Float32Array([0, 1, 1, 1, 0, 0, 1, 0]), t.STATIC_DRAW) : t.bufferData(t.ARRAY_BUFFER, new Float32Array([1, 0, 0, 0, 1, 1, 0, 1]), t.STATIC_DRAW), t.vertexAttribPointer(y, 2, t.FLOAT, !1, 0, 0), t.enableVertexAttribArray(y), this._vao.texcoordBuffer = x, this._yTexture = t.createTexture(), t.bindTexture(t.TEXTURE_2D, this._yTexture), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE), this._uvTexture = t.createTexture(), t.bindTexture(t.TEXTURE_2D, this._uvTexture), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE)
        }
        _createCanvas(t, i, r) {
          r ? (!be || t != be.height || i != be.width) && (be = wx.createOffscreenCanvas({
            width: i,
            height: t,
            type: "webgl"
          })) : (!be || t != be.width || i != be.height) && (be = wx.createOffscreenCanvas({
            width: t,
            height: i,
            type: "webgl"
          }))
        }
        async drawImageAsync(t, i, r, n) {
          const c = this._glContext;
          return c.disable(c.DEPTH_TEST), c.disable(c.BLEND), c.useProgram(this._glProgram), this._ext.bindVertexArrayOES(this._vao), this._legacyFlag && c.uniformMatrix3fv(this._dt, !1, this.displayTransform270), c.pixelStorei(c.UNPACK_ALIGNMENT, 1), c.activeTexture(c.TEXTURE0), c.bindTexture(c.TEXTURE_2D, this._yTexture), c.texImage2D(c.TEXTURE_2D, 0, c.LUMINANCE, r, n, 0, c.LUMINANCE, c.UNSIGNED_BYTE, t), c.activeTexture(c.TEXTURE1), c.bindTexture(c.TEXTURE_2D, this._uvTexture), c.texImage2D(c.TEXTURE_2D, 0, c.LUMINANCE_ALPHA, r / 2, n / 2, 0, c.LUMINANCE_ALPHA, c.UNSIGNED_BYTE, i), c.drawArrays(c.TRIANGLE_STRIP, 0, 4), c.flush(), new Promise(d => {
            const m = this._glCanvas.toDataURL("image/jpeg", .7);
            d(m)
          })
        }
      }
      class cs extends ra {
        constructor(t = !1) {
          super(), this._externalControlFlag = t;
          const i = this._onAcceUpdate;
          this._handler = r => {
            const n = {
              x: -r.x * 10,
              y: -r.y * 10,
              z: r.z * 10
            };
            i.fire(n), this._currentAcce = n
          }
        }
        start() {
          this._externalControlFlag || (wx.startAccelerometer({
            interval: "normal",
            fail: i => {
              throw i
            }
          }), et.log("Wechat accelerometer started by easyar"));
          const t = this._handler;
          wx.onAccelerometerChange(t)
        }
        stop() {
          this._externalControlFlag || (wx.stopAccelerometer(), et.log("Wechat accelerometer stopped by easyar"));
          const t = this._handler;
          wx.offAccelerometerChange(t), this._currentAcce = null
        }
        dispose() {
          this.stop(), this._onAcceUpdate.dispose()
        }
      }
      var ha = (l => (l[l.Android7x = 0] = "Android7x", l[l.Android = 1] = "Android", l[l.IOS = 2] = "IOS", l[l.Other = 3] = "Other", l[l.Unknown = 4] = "Unknown", l))(ha || {});
      const Br = Math.PI / 180;
      class Or extends na {
        constructor(t = !1) {
          super(), this._tag = 4, this._externalControlFlag = t;
          const i = this._onAttituteUpdate;
          this._tag = this._getWxVersionTagForAttitute();
          const r = this._tag;
          et.log("Wx platform tag: " + ha[r]), this._handler = n => {
            const c = la(n, r),
              d = {
                x: c.x,
                y: c.y,
                z: c.z,
                w: c.w,
                systemTimestamp: new Date().getTime()
              };
            i.fire(d)
          }
        }
        start() {
          if (this._tag == 4) throw new Error("Wechat device motion Invalid on unspported device");
          if (this._tag == 3) throw new Error("Wechat device motion invalid on current platform: " + wx.getSystemInfoSync().platform);
          this._externalControlFlag || wx.startDeviceMotionListening({
            interval: "game",
            fail: i => {
              throw i
            }
          });
          const t = this._handler;
          wx.onDeviceMotionChange(t)
        }
        stop() {
          this._externalControlFlag || wx.stopDeviceMotionListening();
          const t = this._handler;
          wx.offDeviceMotionChange(t)
        }
        dispose() {
          this.stop(), this._onAttituteUpdate.dispose()
        }
        _getWxVersionTagForAttitute() {
          let t = wx.getSystemInfoSync();
          return !t || !t.platform ? 4 : t.platform == "ios" ? 2 : t.platform == "android" ? t.version.startsWith("7.") ? 0 : 1 : 3
        }
      }

      function la(l, t) {
        let i = null;
        if (t == 0) i = {
          alpha: -l.alpha,
          beta: -l.beta,
          gamma: -l.gamma
        };
        else if (t == 1) i = {
          alpha: -l.alpha,
          beta: -l.beta,
          gamma: l.gamma
        };
        else if (t == 2) i = {
          alpha: l.alpha,
          beta: l.beta,
          gamma: -l.gamma
        };
        else throw new Error("Device motion invalid on current platform: " + wx.getSystemInfoSync().platform);
        let [r, n, c] = [i.beta, i.alpha, i.gamma].map(A => Br * A), [d, m, f] = [r, n, c].map(A => Math.cos(A / 2)), [w, y, x] = [r, n, c].map(A => Math.sin(A / 2)), S = new qt;
        S.x = w * m * f + d * y * x, S.y = d * y * f - w * m * x, S.z = d * m * x - w * y * f, S.w = d * m * f + w * y * x;
        let R = new qt;
        return R.x = -Math.SQRT1_2, R.w = Math.SQRT1_2, S = S.multiply(R), S
      }
      class us extends Ct {
        constructor(t = !1) {
          super(), this._externalControlFlag = t;
          const i = this._onGpsUpdate;
          this._handler = r => {
            const n = {
              latitude: r.latitude,
              longitude: r.longitude,
              altitude: r.altitude,
              horizontalAccuracy: r.horizontalAccuracy,
              verticalAccuracy: r.verticalAccuracy
            };
            i.fire(n), this._currentGeoLocation = n
          }
        }
        start() {
          this._externalControlFlag || (wx.startLocationUpdate({
            type: "wgs84",
            success: () => {},
            fail: i => {
              throw i
            }
          }), et.log("Wechat geo location update started by easyar"));
          const t = this._handler;
          wx.onLocationChange(t)
        }
        stop() {
          this._externalControlFlag || (wx.stopLocationUpdate(), et.log("Wechat geo location update stopped by easyar"));
          const t = this._handler;
          wx.offLocationChange(t), this._currentGeoLocation = null
        }
        dispose() {
          this.stop(), this._onGpsUpdate.dispose()
        }
      }
      class Ur extends ea {
        constructor(t, i = 0) {
          super(t);
          let r = (i & ze.Accelerometer) !== 0,
            n = (i & ze.GeoLocation) !== 0;
          this._accelerometer = new cs(r), this._geoLocationProvider = new us(n), et.log("Wechat block tracker created, external sensor control flag is: ", i)
        }
      }
      class Nr extends aa {
        constructor(t, i = 0) {
          super(t);
          let r = (i & ze.Accelerometer) !== 0,
            n = (i & ze.GeoLocation) !== 0;
          this._accelerometer = new cs(r), this._geoLocationProvider = new us(n), this._onRequireImage = new V, et.log("Wechat landmark tracker created, external sensor control flag is: ", i)
        }
      }
      const ds = Object.freeze(Object.defineProperty({
          __proto__: null,
          CanvasHandler: Lr,
          WxAccelerometer: cs,
          WxAttituteProvider: Or,
          convertWxDeviceMotionToAttitute: la,
          WxGeoLocationProvider: us,
          wxRequest: bi,
          WxBlockTracker: Ur,
          WxLandmarkTracker: Nr
        }, Symbol.toStringTag, {
          value: "Module"
        })),
        qr = {
          position: Et.zero,
          rotation: qt.identity,
          scale: Et.one
        },
        Vr = Object.freeze(Object.defineProperty({
          __proto__: null,
          TransformIdentity: qr
        }, Symbol.toStringTag, {
          value: "Module"
        }));
      class ca {
        constructor(t, i, r, n) {
          if (this._major = 0, this._minor = 0, this._build = null, this._revision = null, typeof t == "string") {
            let c = t.split(".");
            if (c.length >= 1 && c[0].length > 0) {
              let d = Number.parseInt(c[0]);
              this._major = isNaN(d) ? 0 : d
            }
            if (c.length >= 2 && c[1].length > 0) {
              let d = Number.parseInt(c[1]);
              this._minor = isNaN(d) ? 0 : d
            }
            if (c.length >= 3 && c[2].length > 0) {
              let d = Number.parseInt(c[2]);
              this._build = isNaN(d) ? null : d
            }
            if (c.length >= 4 && c[3].length > 0) {
              let d = Number.parseInt(c[3]);
              this._revision = isNaN(d) ? null : d
            }
          } else typeof t == "number" && (this._major = t | 0, this._minor = i | 0, this._build = r, this._revision = n)
        }
        get major() {
          return this._major
        }
        get minor() {
          return this._minor
        }
        get build() {
          return this._build
        }
        get revision() {
          return this._revision
        }
        toString() {
          return `${this.major}.${this.minor}` + (this.build != null ? `.${this.build}` : "") + (this.revision != null ? `.${this.revision}` : "")
        }
      }
      var ua = (l => (l.Block = "block", l.World = "world", l))(ua || {});
      class Ve {
        static fromAnnotationJson(t) {
          const i = new Ve;
          return i.id = t.id, i.type = t.type, i.timestamp = t.timestamp, t.featureTye && (i.featureTye = t.featureTye), t.properties && (i.properties = t.properties), i
        }
        get name() {
          return this.getProperty("name")
        }
        set name(t) {
          this.setProperty("name", t)
        }
        set properties(t) {
          this._properties = t
        }
        getProperty(t) {
          if (!this._properties) return;
          const i = this._properties[t];
          if (i) return i
        }
        setProperty(t, i) {
          if (i === void 0) {
            if (!this._properties) return;
            console.log(this._properties, 'setProperty');
            this._properties[t] = void 0, Object.keys(this._properties).length == 0 && (this._properties = void 0)
          } else this._properties || (this._properties = {}), this._properties[t] = i
        }
      }
      class da extends Ve {
        static fromNodeJson(t) {
          const i = Ve.fromAnnotationJson(t);
          if (i.geometry = t.geometry, i.parent = t.parent, i.geometry == "point") i.transform = {
            position: t.transform.position,
            rotation: qt.identity,
            scale: Et.one
          };
          else if (i.geometry == "cube") i.transform = {
            position: t.transform.position,
            rotation: t.transform.rotation,
            scale: t.transform.scale
          };
          else throw new Error("Unknown annotation geometry: " + i.geometry);
          return i
        }
      }
      class pa extends Ve {
        get isDirected() {
          const t = this.getProperty("isDirected");
          return t === void 0 ? !0 : t
        }
        set isDirected(t) {
          this.setProperty("isDirected", t)
        }
        get category() {
          return this.getProperty("category")
        }
        set category(t) {
          this.setProperty("category", t)
        }
        static fromRelationshipJson(t) {
          const i = Ve.fromAnnotationJson(t);
          return i.members = t.members, i
        }
      }
      class Ei {
        get version() {
          return this._version
        }
        constructor() {
          this._version = new ca(0, 5, 0)
        }
        static fromJson(t) {
          if (t.version.major != 0 || t.version.minor != 5) throw new Error("Trying to construct Ema v0.5 with data v" + t.version);
          let i = new Ei;
          i.generatedBy = t.generatedBy, t.extensions && (i.extensions = t.extensions), i.blocks = t.blocks;
          let r = new Array;
          if (!t.annotations) return i.annotations = t.annotations, i;
          for (const n of t.annotations)
            if (n.type == "node") {
              const c = da.fromNodeJson(n);
              r.push(c)
            } else if (n.type == "relationship") {
            const c = pa.fromRelationshipJson(n);
            r.push(c)
          }
          return i.annotations = r, i
        }
      }

      function $r(l, t) {
        if (!l || !t) throw new Error("Cannot compare undefined parent of ema");
        if (!l.type || !t.type) throw new Error("Cannot compare ema parent with Unknown type");
        if (l.type === "block") return l.id == t.id;
        if (l.type === "world") {
          const i = l,
            r = t;
          return !i.location.latitude || !r.location.latitude || !i.location.longitude || !r.location.longitude ? !1 : i.location.latitude == r.location.latitude && i.location.longitude == r.location.longitude && i.location.altitude == r.location.altitude
        } else throw new Error("Unknown parent type: " + l.type)
      }

      function jr(l) {
        try {
          if (!l.version) throw new Error("Fail to decode EMA without version info");
          const t = new ca(l.version);
          if (l.version = t, t.major == 0 && t.minor == 5) return Ei.fromJson(l);
          throw new Error("Unsupported Ema version: " + t.toString())
        } catch (t) {
          throw new Error(t)
        }
      }
      const Hr = Object.freeze(Object.defineProperty({
        __proto__: null,
        checkVersion: jr,
        ParentType: ua,
        Annotation: Ve,
        Node: da,
        Relationship: pa,
        Ema_05: Ei,
        isEquivalent: $r
      }, Symbol.toStringTag, {
        value: "Module"
      }));
      console.log("use easyar-core v2.0.10");
      const Gr = Object.freeze(Object.defineProperty({
          __proto__: null,
          ARAssembly: oa,
          Accelerometer: ra,
          AttituteProvider: na,
          BlockLocalizationResponse: ta,
          BlockLocalizerResult: js,
          BlockServiceHandler: Ws,
          BlockTracker: ea,
          BlockTrackerResult: ns,
          CameraParameters: Xt,
          CameraTransformType: _t,
          CloudLocalizerBlockInstance: J,
          CloudLocalizerStatus: Bt,
          CoreVersion: E,
          Debug: et,
          ExternalControlSensor: ze,
          FrameData: Xe,
          FrameSource: hs,
          GeoLocationProvider: Ct,
          LandmarkLocalizationResponse: sa,
          LandmarkLocalizerResult: ia,
          LandmarkServiceHandler: Xs,
          LandmarkTracker: aa,
          LandmarkTrackerResult: os,
          Mat4: kt,
          Mathf: Rt,
          MotionTrackingStatus: ye,
          Platform: k,
          PoseFusion: Si,
          PoseFusionLegacy: Js,
          PoseHolder: rs,
          Quat: qt,
          Recorder: bt,
          ServiceHandler: ss,
          ThreeDofHelper: zr,
          TimeMatrix4d: ls,
          Tracker: as,
          Vec3: Et,
          VersionTag: ri,
          ema: Hr,
          event: ct,
          getPoseFusion: Hs,
          jsSHA: ts,
          text: yt,
          tf: Vr,
          util: is,
          wx: ds
        }, Symbol.toStringTag, {
          value: "Module"
        })),
        ma = {
          PACM00: "PACT00"
        },
        ga = class {
          constructor() {
            this._systemInfo = null, this._isAliPay = null, this._isWeChat = null, this._isBrowser = null, this._calibData = null, this._isWeChat = typeof wx < "u" && !wx.isMy, this._isAliPay = typeof my < "u", this._isBrowser = typeof document < "u", this._updateSystemInfo()
          }
          static get instance() {
            return this._instance == null && (this._instance = new ga), this._instance
          }
          _updateSystemInfo() {
            if (this._isWeChat) {
              let l = wx.getSystemInfoSync();
              this._systemInfo = l
            } else if (this._isAliPay) {
              let l = my.getSystemInfoSync();
              this._systemInfo = l
            } else typeof document < "u" && (this._systemInfo = null)
          }
          get isAliPay() {
            return this._isAliPay
          }
          get isWeChat() {
            return this._isWeChat
          }
          get isBrowser() {
            return this._isBrowser
          }
          get isIos() {
            if (this._isWeChat) return this._systemInfo.platform == "ios";
            if (this._isAliPay) return this._systemInfo.platform == "iOS" || this._systemInfo.platform == "iPhone OS";
            if (this._isBrowser) return navigator.userAgent.indexOf("iPhone") > -1
          }
          get isAndroid() {
            if (this._isWeChat) return this._systemInfo.platform == "android";
            if (this._isAliPay) return this._systemInfo.platform == "Android";
            if (this._isBrowser) return navigator.userAgent.indexOf("Android") > -1
          }
          get windowWidth() {
            return this._systemInfo.windowWidth
          }
          get windowHeight() {
            return this._systemInfo.windowHeight
          }
          get pixelRatio() {
            return this._systemInfo.pixelRatio
          }
          get version() {
            return this._systemInfo.version
          }
          loadPlugin(l) {
            if (this._isAliPay) return my.loadPlugin(l);
            if (this._isWeChat) return g.warn("\u5FAE\u4FE1\u5E73\u53F0\u4E0D\u652F\u6301 loadPlugin \u64CD\u4F5C"), null
          }
          get sdkVersion() {
            if (this._isAliPay) return this._systemInfo.SDKVersion;
            if (this._isWeChat) return this._systemInfo.SDKVersion
          }
          isSDKVersionNotLess(l) {
            let t = this.sdkVersion.split("."),
              i = l.split(".");
            for (let r = 0; r < i.length; r++) {
              let n = parseInt(t[r]),
                c = parseInt(i[r]);
              if (n > c) return !0;
              if (n < c) return !1
            }
            return !0
          }
          get deviceModel() {
            return ma[this._systemInfo.model] ? ma[this._systemInfo.model] : this._systemInfo.model
          }
          get benchmarkLevel() {
            if (!this._isAliPay && this._isWeChat) return this._systemInfo.benchmarkLevel
          }
          get system() {
            return this._systemInfo.system
          }
          get isSystemNotLessAndriod9() {
            return this.system.toLowerCase().indexOf("android") > -1 && Number(this.system.split(" ")[1].split(".")[0]) >= 9
          }
          async getCalibData() {
            if (this._calibData) return this._calibData;
            try {
              let l = (await is.fetchCalibIntrinsics(k.Wechat)).devices.find(t => t.model.toUpperCase() == this.deviceModel.toUpperCase());
              if (l) {
                let t = {
                  width: l.w,
                  height: l.h,
                  fx: l.f_x,
                  fy: l.f_y,
                  cx: l.c_x,
                  cy: l.c_y
                };
                return this._calibData = t, Promise.resolve(t)
              } else return Promise.reject()
            } catch {
              return Promise.reject()
            }
          }
        };
      let Ft = ga;
      Ft._instance = null;
      class oi {
        constructor(t, i) {
          this._worldMatrix = null, this._projectMatrix = null, this._textureProject = null, this._initialized = !1, this._startCallBack = null, this.pc = t, this.app = i, this._worldMatrix = new t.Mat4, this._projectMatrix = new t.Mat4, this._textureProject = new t.Mat4, this._viewWidth = i.graphicsDevice.canvas.width, this._viewHeight = i.graphicsDevice.canvas.height, this._near = .1, this._far = 1e3
        }
        static canIUse(t = o.Dof6) {
          console.warn("\u8BE5\u63A5\u53E3\u5DF2\u542F\u7528\uFF0C\u8BF7\u4F7F\u7528 queryARSupport \u4EE3\u66FF\uFF0C\u5E76\u4F9D\u636E\u8FD4\u56DE\u503C\u8FDB\u884C\u5224\u5B9A");
          let i = null;
          switch (t) {
            case o.Camera:
              i = u.CAMERA;
              break;
            case o.Dof3:
              i = u.WorldTracking;
              break;
            case o.Dof6:
              i = u.WorldTracking;
              break;
            default:
              return Promise.resolve(!1)
          }
          return ARSession && ARSession.isSupported({
            mode: i
          }) ? Promise.resolve(!0) : Promise.resolve(!1)
        }
        static async queryARSupport() {
          return this.supportTrackMode = o.Dof6, Promise.resolve({
            arBaseMode: h.ARSession,
            arTrackMode: o.Dof6
          })
        }
        create(t, i, r) {
          const n = () => {
            switch (this.trackMode = t.trackMode, this.trackMode) {
              case o.Dof6:
                this._curTrackMode = u.WorldTracking;
                break;
              case o.Dof3:
                this._curTrackMode = u.WorldTracking;
                break;
              case o.Camera:
                this._curTrackMode = u.CAMERA;
                break
            }
            const c = this._curTrackMode;
            ARSession && ARSession.isSupported({
              mode: c
            }) ? ARSession.createSession({
              mode: c,
              success: d => {
                this.curARSession = d, i && i()
              },
              fail: () => {
                r && r()
              }
            }) : (g.error("\u4E0D\u652F\u6301:" + c), r && r())
          };
          this._initialized ? n() : (Ft.instance.isIos || Ft.instance.loadPlugin("ARSession"), ARSession ? (this._initialized = !0, n()) : (g.error("\u652F\u4ED8\u5B9D\u7248\u672C\u6709\u8BEF,\u672A\u5305\u542BARSession !"), r && r()))
        }
        update() {
          const t = this._curARFrame;
          if (t) {
            switch (this.updateTexture(), this.trackMode) {
              case o.Dof3:
              case o.Dof6:
                this.updatePosition(), Jt.instance.clsClient && Jt.instance.clsClient.updateFrame(t);
                break
            }
            this.disposeFrame()
          }
        }
        start(t, i, r) {
          let n = !1;
          if (this.curARSession) {
            const c = {
              vw: this._viewWidth,
              vh: this._viewHeight,
              needImuFilter: !0
            };
            switch (this._curTrackMode) {
              case u.WorldTracking:
                n = this.curARSession.start(JSON.stringify(c));
                break;
              case u.OrientationTracking:
                n = this.curARSession.start(JSON.stringify(c));
                break;
              case u.CAMERA:
                n = this.curARSession.start(JSON.stringify(c));
                break
            }
          } else g.error("start\u5931\u8D25,\u8BF7\u68C0\u67E5\u662F\u5426\u521B\u5EFA\u5B9E\u4F8B");
          this._startCallBack = r, n ? (this.app.xr.session || (g.info("\u5173\u95ED App3d \u81EA\u52A8\u5237\u65B0"), this.app.xr = {
            session: {
              requestAnimationFrame: () => {}
            },
            end: () => {},
            destroy: () => {}
          }), this.curARSession.onARFrame(c => {
            this._curARFrame = c, this.app.tick()
          }), t && t()) : i && i()
        }
        destroy() {
          ARSession.removeSession(), this.curARSession = null, this._bgMaterial && (this._bgMaterial.destroy(), this._bgMaterial = null)
        }
        resume() {}
        pause() {}
        onShow() {}
        onHide() {}
        updatePosition() {
          const {
            _curARFrame: t
          } = this, {
            camera: i
          } = t;
          switch (i.transform[12] /= 100, i.transform[13] /= 100, i.transform[14] /= 100, this.trackMode) {
            case o.Dof6:
              i.trackingState === "normal" && (this._worldMatrix.set(i.transform), this._projectMatrix.set(i.projection).transpose(), this._startCallBack && (this._startCallBack(), this._startCallBack = null));
              break;
            case o.Dof3:
              if (i.trackingState === "normal") {
                const c = this._worldMatrix;
                c.set(i.transform), c.data[12] = c.data[13] = c.data[14] = 0, this._projectMatrix.set(i.projection).transpose(), this._startCallBack && (this._startCallBack(), this._startCallBack = null)
              }
              break
          }
          const {
            _near: r,
            _far: n
          } = this;
          this._projectMatrix.data[10] = (r + n) / (r - n), this._projectMatrix.data[14] = 2 * r * n / (r - n)
        }
        updateTexture() {
          const {
            capturedImage: t,
            width: i,
            height: r,
            capturedImageMatrix: n
          } = this._curARFrame;
          if (i * r > 0 && t && n) {
            if (!this._textureY) {
              this._textureY = new this.pc.Texture(this.app.graphicsDevice, {
                width: i,
                height: r,
                format: this.pc.PIXELFORMAT_A8,
                mipmaps: !1,
                addressU: this.pc.ADDRESS_CLAMP_TO_EDGE,
                addressV: this.pc.ADDRESS_CLAMP_TO_EDGE
              }), this._bgMaterial && (this._bgMaterial.setParameter("u_frameY", this._textureY), this._bgMaterial.update()), this._textureUV = new this.pc.Texture(this.app.graphicsDevice, {
                width: i / 2,
                height: r / 2,
                format: this.pc.PIXELFORMAT_L8_A8,
                mipmaps: !1,
                addressU: this.pc.ADDRESS_CLAMP_TO_EDGE,
                addressV: this.pc.ADDRESS_CLAMP_TO_EDGE
              }), this._bgMaterial && (this._bgMaterial.setParameter("u_frameUV", this._textureUV), this._bgMaterial.update()), this._scaleMatrix = new this.pc.Mat4;
              const f = this._viewWidth,
                w = this._viewHeight,
                y = r,
                x = i,
                S = f / w,
                R = y / x,
                A = S / R;
              A > 1 ? (this._scaleMatrix.data[0] = 1, this._scaleMatrix.data[5] = A) : (this._scaleMatrix.data[0] = 1 / A, this._scaleMatrix.data[5] = 1), this._bgMaterial && (this._bgMaterial.setParameter("u_scaleMatrix", this._scaleMatrix.data), this._bgMaterial.update())
            }
            this._textureProject.set(n), this._bgMaterial && (this._bgMaterial.setParameter("u_proMatrix", this._textureProject.data), this._bgMaterial.update());
            const c = t.byteLength,
              d = i * r;
            let m = this._textureY.lock();
            m.set(new Uint8Array(t, 0, d)), this._textureY.unlock(), m = this._textureUV.lock(), m.set(new Uint8Array(t, d, c - d)), this._textureUV.unlock()
          }
        }
        getBackgroundMaterial() {
          if (this._bgMaterial) return this._bgMaterial; {
            const t = this.app.graphicsDevice,
              i = ["attribute vec3 POSITION;", "uniform mat4 u_proMatrix;", "uniform mat4 u_scaleMatrix;", "varying vec2 v_uv;", "void main() {", "v_uv = (u_proMatrix * vec4(POSITION.x * 0.5 + 0.5, POSITION.y * 0.5 + 0.5, 1.0, 1.0)).xy;", "gl_Position = u_scaleMatrix * vec4( POSITION.xy, 1.0, 1.0);", "gl_Position.z = gl_Position.w;", "}"].join(`
`),
              r = [`precision ${t.precision} float;`, "uniform sampler2D u_frameY;", "uniform sampler2D u_frameUV;", "varying vec2 v_uv;", "", "void main() {", "  vec2 cbcr = texture2D(u_frameUV, v_uv).ra - vec2(0.5, 0.5);", "  vec3 ycbcr = vec3(texture2D(u_frameY, v_uv).a, cbcr);", "  vec3 rgb = mat3(1.0, 1.0, 1.0,0.0, -0.344136, 1.772,1.402, -0.714136, 0.0) * ycbcr;", "", "  gl_FragColor = vec4(rgb, 1.0);", "}"].join(`
`);
            return this._bgShader = new this.pc.Shader(t, {
              attributes: {
                POSITION: this.pc.SEMANTIC_POSITION
              },
              vshader: i,
              fshader: r
            }), this._bgMaterial = new this.pc.Material, this._bgMaterial.shader = this._bgShader, this._bgMaterial.depthTest = !1, this._bgMaterial.depthWrite = !1, this._bgMaterial.update(), this._bgMaterial
          }
        }
        disposeFrame() {
          this._curARFrame = null
        }
      }
      oi.supportTrackMode = null, oi.arBaseMode = h.ARSession;
      var hi = (l => (l.motionTrack = "motionTrack", l.localizer = "localizer", l.rtct = "rtct", l.megaTrack = "megaTrack", l))(hi || {}),
        ps = (l => (l.VIO = "VIO", l.SLAM = "SLAM", l.ANCHOR = "ANCHOR", l.LARGE_SCALE = "LARGE_SCALE", l))(ps || {}),
        le = (l => (l[l.notInit = 0] = "notInit", l[l.enable = 1] = "enable", l[l.disable = 2] = "disable", l))(le || {});
      const Kt = class {
        constructor(l, t) {
          this._worldMatrix = null, this._projectMatrix = null, this._textureProject = null, this.pc = l, this.app = t, this._worldMatrix = new l.Mat4, this._projectMatrix = new l.Mat4, this._textureProject = new l.Mat4, this._viewWidth = t.graphicsDevice.canvas.width, this._viewHeight = t.graphicsDevice.canvas.height, this._near = .1, this._far = 1e3, this._rotationMatrix = new l.Mat4().set([0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
        }
        static canIUse(l = o.Dof6) {
          console.warn("\u8BE5\u63A5\u53E3\u5DF2\u542F\u7528\uFF0C\u8BF7\u4F7F\u7528 queryARSupport \u4EE3\u66FF\uFF0C\u5E76\u4F9D\u636E\u8FD4\u56DE\u503C\u8FDB\u884C\u5224\u5B9A");
          let t = hi.megaTrack;
          return new Promise((i, r) => {
            Ft.instance.loadPlugin("ExpAR"), ExpARLoader ? ExpARLoader.load({
              success: () => {
                ExpAREngine.init({
                  success: () => {
                    switch (Kt.arSupportMap[t]) {
                      case le.enable:
                        i(!0);
                        break;
                      case le.disable:
                        i(!1);
                        break;
                      default:
                        ExpAREngine.isSupported({
                          mode: t,
                          complete: n => {
                            if (n.isSupported) Kt.arSupportMap[t] = le.enable, i(!0);
                            else try {
                              ExpAREngine.downloadCalibration({
                                complete: function (c) {
                                  c.status == 0 ? (this.arSupportMap[t] = le.enable, i(!0)) : (this.arSupportMap[t] = le.disable, i(!1))
                                }
                              })
                            } catch (c) {
                              r(c)
                            }
                          }
                        });
                        break
                    }
                    Kt.initialized = !0
                  },
                  fail: () => {
                    i(!1)
                  }
                })
              },
              fail: () => {
                i(!1)
              }
            }) : (g.info("[MY] onReady: expARLoader not defined"), i(!1))
          })
        }
        static async initializExpAREngine() {
          return new Promise((l, t) => {
            if (g.log("\u5F00\u59CB\u52A0\u8F7D ExpARLoader"), ExpARLoader) l(null);
            else {
              if (Ft.instance.loadPlugin("ExpAR"), !ExpARLoader) {
                g.error("No ExpARLoader"), t("No ExpARLoader");
                return
              }
              l(null)
            }
          }).then(() => (g.log("\u52A0\u8F7D ExpARLoader \u6210\u529F\uFF0C\u5F00\u59CBload ExpAREngine"), this._ExpARLoaderPromise ? this._ExpARLoaderPromise : (this._ExpARLoaderPromise = new Promise((l, t) => {
            ExpARLoader.load({
              success: () => {
                l(null)
              },
              fail: () => {
                g.error("ExpEngine load error"), t("ExpEngine load error")
              }
            })
          }), this._ExpARLoaderPromise))).then(() => (g.log("\u52A0\u8F7D ExpAREngine \u6210\u529F\uFF0C\u5F00\u59CB\u521D\u59CB\u5316 ExpAREngine"), this._ExpAREngineInitPromise ? this._ExpAREngineInitPromise : (this._ExpAREngineInitPromise = new Promise((l, t) => {
            ExpAREngine.init({
              success: () => {
                this.initialized = !0, l(null), g.log("Enging \u521D\u59CB\u5316\u6210\u529F")
              },
              fail: () => {
                g.error("ExpAREngine init error"), t("ExpAREngine init error")
              }
            })
          }), this._ExpAREngineInitPromise)))
        }
        static async queryARSupport() {
          return this.initialized || await this.initializExpAREngine(), this._DownloadCalibrationPromise || (this._DownloadCalibrationPromise = new Promise((l, t) => {
            ExpAREngine.downloadCalibration({
              complete: i => {
                g.log("\u66F4\u65B0\u6807\u5B9A\u6570\u636E:", i.status), l(null)
              }
            })
          })), this._DownloadAREngineDeviceListPromise || (this._DownloadAREngineDeviceListPromise = new Promise(l => {
            ExpAREngine.downloadAREngineDeviceList({
              complete: t => {
                g.log("\u66F4\u65B0 AREngine \u673A\u578B\u9ED1\u540D\u5355\uFF1A", t.status), l(null)
              }
            })
          })), await Promise.all([this._DownloadAREngineDeviceListPromise, this._DownloadCalibrationPromise]), new Promise((l, t) => {
            ExpAREngine.querySupport({
              complete: i => {
                switch (i.support) {
                  case "6dof":
                    Kt.supportTrackMode = o.Dof6;
                    break;
                  case "3dof":
                    Kt.supportTrackMode = o.Dof3;
                    break;
                  case "0dof":
                    Kt.supportTrackMode = o.Camera;
                    break
                }
                l({
                  arBaseMode: h.EasyAR,
                  arTrackMode: Kt.supportTrackMode
                })
              }
            })
          })
        }
        async create(l, t, i) {
          this._config = l;
          const r = async () => {
            this.trackMode = l.trackMode;
            let n = hi.megaTrack;
            ps.LARGE_SCALE, Kt.supportTrackMode == null && (await Kt.queryARSupport(), this.trackMode = Kt.supportTrackMode, g.info("\u652F\u6301 AR \u529F\u80FD\u6A21\u5F0F\uFF1A" + n + " + " + o[Kt.supportTrackMode]));
            const c = {
              mode: hi.megaTrack,
              trackingMode: ps.LARGE_SCALE,
              viewWidth: this._viewWidth,
              viewHeight: this._viewHeight,
              nearPlane: this._near,
              farPlane: this._far,
              deviceRotation: 0
            };
            n == hi.megaTrack && (c.apiKey = l.clsConfig.apiKey, c.apiSecret = l.clsConfig.apiSecret, c.appId = l.clsConfig.clsAppId, c.preferArEngine = !0), this.curARSession && ExpAREngine.destroyInstance(this.curARSession);
            try {
              this.curARSession = ExpAREngine.createInstance(c), t && t()
            } catch {
              i && i()
            }
          };
          Kt.initialized ? r() : Kt.initializExpAREngine().then(() => {
            r()
          }).catch(() => {
            i && i()
          })
        }
        start(l, t) {
          try {
            this.curARSession && this.curARSession.start(), l && l()
          } catch {
            t && t()
          }
        }
        update() {
          if (this.curARSession) {
            const l = this._curARFrame = this.curARSession.peekFrame();
            l && (this.updateTexture(), this.updatePosition(), Jt.instance.clsClient && Jt.instance.clsClient.updateFrame(l), this.disposeFrame())
          }
        }
        destroy() {
          this._curARFrame && (this.curARSession.disposeFrame(this._curARFrame), this._curARFrame = null), this.curARSession && (ExpAREngine.destroyInstance(this.curARSession), this.curARSession = null), this._bgMaterial && (this._bgMaterial.destroy(), this._bgMaterial = null)
        }
        _canIUse(l, t, i) {
          switch (Kt.arSupportMap[l]) {
            case le.enable:
              t();
              break;
            case le.disable:
              i && i();
              break;
            default:
              ExpAREngine.isSupported({
                mode: l,
                complete: r => {
                  if (r.isSupported) Kt.arSupportMap[l] = le.enable, t();
                  else try {
                    ExpAREngine.downloadCalibration({
                      complete: function (n) {
                        n.status == 0 ? (this.arSupportMap[l] = le.enable, t()) : (this.arSupportMap[l] = le.disable, i && i())
                      }
                    })
                  } catch {
                    i && i()
                  }
                }
              });
              break
          }
        }
        pause() {
          this.initialized && ExpAREngine.pause()
        }
        resume() {
          this.initialized && ExpAREngine.resume()
        }
        onShow() {
          this.resume()
        }
        onHide() {
          this.pause()
        }
        updatePosition() {
          const {
            camera: l,
            timestamp: t,
            results: i
          } = this._curARFrame;
          l.trackingStatus != -1 && (this._worldMatrix.set(l.transform), this._worldMatrix.mul2(this._rotationMatrix, this._worldMatrix), this._worldMatrix.transpose(), this._projectMatrix.set(l.projection), this._projectMatrix.mul2(this._rotationMatrix, this._projectMatrix), this._projectMatrix.transpose())
        }
        updateTexture() {
          const {
            image: l
          } = this._curARFrame;
          if (l) {
            const {
              pixelWidth: t,
              pixelHeight: i,
              rawData: r
            } = l;
            this._textureY || (this._textureY = new this.pc.Texture(this.app.graphicsDevice, {
              width: t,
              height: i,
              format: this.pc.PIXELFORMAT_A8,
              mipmaps: !1,
              addressU: this.pc.ADDRESS_CLAMP_TO_EDGE,
              addressV: this.pc.ADDRESS_CLAMP_TO_EDGE
            }), this._bgMaterial && (this._bgMaterial.setParameter("u_frameY", this._textureY), this._bgMaterial.update()), this._textureUV = new this.pc.Texture(this.app.graphicsDevice, {
              width: t / 2,
              height: i / 2,
              format: this.pc.PIXELFORMAT_L8_A8,
              mipmaps: !1,
              addressU: this.pc.ADDRESS_CLAMP_TO_EDGE,
              addressV: this.pc.ADDRESS_CLAMP_TO_EDGE
            }), this._bgMaterial && (this._bgMaterial.setParameter("u_frameUV", this._textureUV), this._bgMaterial.update())), this._textureProject.set(l.imageProjection).transpose(), this._bgMaterial && (this._bgMaterial.setParameter("u_proMatrix", this._textureProject.data), this._bgMaterial.update());
            const n = r.byteLength,
              c = t * i;
            let d = this._textureY.lock();
            d.set(new Uint8Array(r, 0, c)), this._textureY.unlock(), d = this._textureUV.lock(), d.set(new Uint8Array(r, c, n - c)), this._textureUV.unlock()
          }
        }
        getBackgroundMaterial() {
          if (this._bgMaterial) return this._bgMaterial; {
            const l = this.app.graphicsDevice,
              t = ["attribute vec3 POSITION;", "", "uniform mat4 u_proMatrix;", "varying vec2 v_uv;", "", "void main() {", "  v_uv = POSITION.xy * 0.5 + 0.5;", "  v_uv.y = 1.0 - v_uv.y;", "  vec4 position =  u_proMatrix * vec4(POSITION.xy, 1.0, 1.0);", "  position.z = position.w;", "  gl_Position = position;", "}"].join(`
`),
              i = [`precision ${l.precision} float;`, "uniform sampler2D u_frameY;", "uniform sampler2D u_frameUV;", "varying vec2 v_uv;", "", "void main() {", "  vec2 cbcr = texture2D(u_frameUV, v_uv).ar - vec2(0.5, 0.5);", "  vec3 ycbcr = vec3(texture2D(u_frameY, v_uv).a, cbcr);", "  vec3 rgb = mat3(1, 1, 1, 0, -0.344, 1.772, 1.402, -0.714, 0) * ycbcr;", "  gl_FragColor = vec4(rgb, 1.0);", "}"].join(`
`);
            return this._bgShader = new this.pc.Shader(l, {
              attributes: {
                POSITION: this.pc.SEMANTIC_POSITION
              },
              vshader: t,
              fshader: i
            }), this._bgMaterial = new this.pc.Material, this._bgMaterial.shader = this._bgShader, this._bgMaterial.depthTest = !1, this._bgMaterial.depthWrite = !1, this._bgMaterial.update(), this._bgMaterial
          }
        }
        setClsConfig(l) {
          this._config.clsConfig = l, this.start()
        }
        disposeFrame() {
          this._curARFrame && this.curARSession.disposeFrame(this._curARFrame), this._curARFrame = null
        }
      };
      let se = Kt;
      se.initialized = !1, se.supportTrackMode = null, se.arBaseMode = h.EasyAR, se.arSupportMap = {}, se._ExpARLoaderPromise = null, se._ExpAREngineInitPromise = null, se._DownloadCalibrationPromise = null, se._DownloadAREngineDeviceListPromise = null;
      class Me {
        constructor(t = 0, i = 0, r = 0) {
          this.x = t, this.y = i, this.z = r
        }
        set(t, i, r) {
          this.x = t, this.y = i, this.z = r
        }
        clone() {
          return new Me(this.x, this.y, this.z)
        }
        scale(t) {
          return this.x *= t, this.y *= t, this.z *= t, this
        }
        getLength() {
          let t = this.x * this.x + this.y * this.y + this.z * this.z;
          return Math.sqrt(t)
        }
        getLengthSq() {
          return this.x * this.x + this.y * this.y + this.z * this.z
        }
        normalize() {
          let t = this.x * this.x + this.y * this.x + this.z * this.z;
          if (t > 0) {
            var i = 1 / Math.sqrt(t);
            this.x *= i, this.y *= i, this.z *= i
          }
          return this
        }
        add(t) {
          return this.x += t.x, this.y += t.y, this.z += t.z, this
        }
        sub(t) {
          return this.x -= t.x, this.y -= t.y, this.z -= t.z, this
        }
        distance(t) {
          return this.clone().sub(t).getLength()
        }
        dot(t) {
          return this.x * t.x + this.y * t.y + this.z * t.z
        }
        getAngle(t) {
          let i = this.dot(t) / (this.getLength() * t.getLength());
          return Math.acos(i) * 180 / Math.PI
        }
      }
      class ms {
        constructor(t, i, r, n) {
          this.x = t || 0, this.y = i || 0, this.z = r || 0, this.w = n || 0
        }
        setFromMat4(t) {
          let i = this,
            r, n, c, d, m, f, w, y, x, S, R, A, P, z, U;
          return r = t.data[0], n = t.data[4], c = t.data[8], d = t.data[1], m = t.data[5], f = t.data[9], w = t.data[2], y = t.data[6], x = t.data[10], P = r * r + n * n + c * c, P === 0 || (P = 1 / Math.sqrt(P), z = d * d + m * m + f * f, z === 0) || (z = 1 / Math.sqrt(z), U = w * w + y * y + x * x, U === 0) || (U = 1 / Math.sqrt(U), r *= P, n *= P, c *= P, d *= z, m *= z, f *= z, w *= U, y *= U, x *= U, S = r + m + x, S >= 0 ? (R = Math.sqrt(S + 1), i.w = R * .5, R = .5 / R, i.x = (f - y) * R, i.y = (w - c) * R, i.z = (n - d) * R) : r > m ? r > x ? (A = r - (m + x) + 1, A = Math.sqrt(A), i.x = A * .5, A = .5 / A, i.w = (f - y) * A, i.y = (n + d) * A, i.z = (c + w) * A) : (A = x - (r + m) + 1, A = Math.sqrt(A), i.z = A * .5, A = .5 / A, i.w = (n - d) * A, i.x = (w + c) * A, i.y = (y + f) * A) : m > x ? (A = m - (x + r) + 1, A = Math.sqrt(A), i.y = A * .5, A = .5 / A, i.w = (w - c) * A, i.z = (f + y) * A, i.x = (d + n) * A) : (A = x - (r + m) + 1, A = Math.sqrt(A), i.z = A * .5, A = .5 / A, i.w = (n - d) * A, i.x = (w + c) * A, i.y = (y + f) * A)), i
        }
        slerp(t, i, r) {
          const n = t.x,
            c = t.y,
            d = t.z,
            m = t.w;
          let f = i.x,
            w = i.y,
            y = i.z,
            x = i.w,
            S = m * x + n * f + c * w + d * y;
          if (S < 0 && (x = -x, f = -f, w = -w, y = -y, S = -S), Math.abs(S) >= 1) return this.w = m, this.x = n, this.y = c, this.z = d, this;
          const R = Math.acos(S),
            A = Math.sqrt(1 - S * S);
          if (Math.abs(A) < .001) return this.w = m * .5 + x * .5, this.x = n * .5 + f * .5, this.y = c * .5 + w * .5, this.z = d * .5 + y * .5, this;
          const P = Math.sin((1 - r) * R) / A,
            z = Math.sin(r * R) / A;
          return this.w = m * P + x * z, this.x = n * P + f * z, this.y = c * P + w * z, this.z = d * P + y * z, this
        }
        mul(t) {
          const i = this.x,
            r = this.y,
            n = this.z,
            c = this.w,
            d = t.x,
            m = t.y,
            f = t.z,
            w = t.w;
          return this.x = c * d + i * w + r * f - n * m, this.y = c * m + r * w + n * d - i * f, this.z = c * f + n * w + i * m - r * d, this.w = c * w - i * d - r * m - n * f, this
        }
      }
      class Ut {
        constructor() {
          let t = new Float32Array(16);
          t[0] = t[5] = t[10] = t[15] = 1, this.data = t
        }
        static fromArray(t) {
          return new Ut().set(t)
        }
        set(t) {
          for (let i = 0; i < t.length; i++) this.data[i] = t[i];
          return this
        }
        clone() {
          let t = new Ut;
          return t.set(this.data), t
        }
        transpose() {
          let t = this.data,
            i;
          return i = t[1], t[1] = t[4], t[4] = i, i = t[2], t[2] = t[8], t[8] = i, i = t[6], t[6] = t[9], t[9] = i, i = t[3], t[3] = t[12], t[12] = i, i = t[7], t[7] = t[13], t[13] = i, i = t[11], t[11] = t[14], t[14] = i, this
        }
        getInverse() {
          let t = this.data,
            i = [],
            r = t[0],
            n = t[1],
            c = t[2],
            d = t[3],
            m = t[4],
            f = t[5],
            w = t[6],
            y = t[7],
            x = t[8],
            S = t[9],
            R = t[10],
            A = t[11],
            P = t[12],
            z = t[13],
            U = t[14],
            Y = t[15],
            mt = S * U * y - z * R * y + z * w * A - f * U * A - S * w * Y + f * R * Y,
            gt = P * R * y - x * U * y - P * w * A + m * U * A + x * w * Y - m * R * Y,
            dt = x * z * y - P * S * y + P * f * A - m * z * A - x * f * Y + m * S * Y,
            ot = P * S * w - x * z * w - P * f * R + m * z * R + x * f * U - m * S * U,
            ht = r * mt + n * gt + c * dt + d * ot;
          if (ht === 0) throw new Error("error!");
          let $ = 1 / ht;
          return i[0] = mt * $, i[1] = (z * R * d - S * U * d - z * c * A + n * U * A + S * c * Y - n * R * Y) * $, i[2] = (f * U * d - z * w * d + z * c * y - n * U * y - f * c * Y + n * w * Y) * $, i[3] = (S * w * d - f * R * d - S * c * y + n * R * y + f * c * A - n * w * A) * $, i[4] = gt * $, i[5] = (x * U * d - P * R * d + P * c * A - r * U * A - x * c * Y + r * R * Y) * $, i[6] = (P * w * d - m * U * d - P * c * y + r * U * y + m * c * Y - r * w * Y) * $, i[7] = (m * R * d - x * w * d + x * c * y - r * R * y - m * c * A + r * w * A) * $, i[8] = dt * $, i[9] = (P * S * d - x * z * d - P * n * A + r * z * A + x * n * Y - r * S * Y) * $, i[10] = (m * z * d - P * f * d + P * n * y - r * z * y - m * n * Y + r * f * Y) * $, i[11] = (x * f * d - m * S * d - x * n * y + r * S * y + m * n * A - r * f * A) * $, i[12] = ot * $, i[13] = (x * z * c - P * S * c + P * n * R - r * z * R - x * n * U + r * S * U) * $, i[14] = (P * f * c - m * z * c - P * n * w + r * z * w + m * n * U - r * f * U) * $, i[15] = (m * S * c - x * f * c + x * n * w - r * S * w - m * n * R + r * f * R) * $, this.data = new Float32Array(i), this
        }
        determinant() {
          const t = this.data,
            i = t[0],
            r = t[4],
            n = t[8],
            c = t[12],
            d = t[1],
            m = t[5],
            f = t[9],
            w = t[13],
            y = t[2],
            x = t[6],
            S = t[10],
            R = t[14],
            A = t[3],
            P = t[7],
            z = t[11],
            U = t[15];
          return A * (+c * f * x - n * w * x - c * m * S + r * w * S + n * m * R - r * f * R) + P * (+i * f * R - i * w * S + c * d * S - n * d * R + n * w * y - c * f * y) + z * (+i * w * x - i * m * R - c * d * x + r * d * R + c * m * y - r * w * y) + U * (-n * m * y - i * f * x + i * m * S + n * d * x - r * d * S + r * f * y)
        }
        decompose() {
          const t = this.data;
          let i = new Me(t[0], t[1], t[2]).getLength(),
            r = new Me(t[4], t[5], t[6]).getLength(),
            n = new Me(t[8], t[9], t[10]).getLength();
          this.determinant() < 0 && (i = -i);
          let c = new Me(t[12], t[13], t[14]),
            d = new Ut;
          d.set(this.data);
          const m = 1 / i,
            f = 1 / r,
            w = 1 / n;
          d.data[0] *= m, d.data[1] *= m, d.data[2] *= m, d.data[4] *= f, d.data[5] *= f, d.data[6] *= f, d.data[8] *= w, d.data[9] *= w, d.data[10] *= w;
          let y = new Me(i, r, n);
          return y.x = i, y.y = r, y.z = n, {
            position: c,
            rotation: d,
            scale: y
          }
        }
        compose(t, i, r) {
          const n = this.data,
            c = i.x,
            d = i.y,
            m = i.z,
            f = i.w,
            w = c + c,
            y = d + d,
            x = m + m,
            S = c * w,
            R = c * y,
            A = c * x,
            P = d * y,
            z = d * x,
            U = m * x,
            Y = f * w,
            mt = f * y,
            gt = f * x,
            dt = r.x,
            ot = r.y,
            ht = r.z;
          return n[0] = (1 - (P + U)) * dt, n[1] = (R + gt) * dt, n[2] = (A - mt) * dt, n[3] = 0, n[4] = (R - gt) * ot, n[5] = (1 - (S + U)) * ot, n[6] = (z + Y) * ot, n[7] = 0, n[8] = (A + mt) * ht, n[9] = (z - Y) * ht, n[10] = (1 - (S + P)) * ht, n[11] = 0, n[12] = t.x, n[13] = t.y, n[14] = t.z, n[15] = 1, this
        }
        multiplyMatrices(t, i) {
          const r = t.data,
            n = i.data,
            c = this.data,
            d = r[0],
            m = r[4],
            f = r[8],
            w = r[12],
            y = r[1],
            x = r[5],
            S = r[9],
            R = r[13],
            A = r[2],
            P = r[6],
            z = r[10],
            U = r[14],
            Y = r[3],
            mt = r[7],
            gt = r[11],
            dt = r[15],
            ot = n[0],
            ht = n[4],
            $ = n[8],
            ft = n[12],
            ut = n[1],
            At = n[5],
            jt = n[9],
            Nt = n[13],
            Ot = n[2],
            ue = n[6],
            de = n[10],
            ae = n[14],
            pe = n[3],
            me = n[7],
            re = n[11],
            ne = n[15];
          return c[0] = d * ot + m * ut + f * Ot + w * pe, c[4] = d * ht + m * At + f * ue + w * me, c[8] = d * $ + m * jt + f * de + w * re, c[12] = d * ft + m * Nt + f * ae + w * ne, c[1] = y * ot + x * ut + S * Ot + R * pe, c[5] = y * ht + x * At + S * ue + R * me, c[9] = y * $ + x * jt + S * de + R * re, c[13] = y * ft + x * Nt + S * ae + R * ne, c[2] = A * ot + P * ut + z * Ot + U * pe, c[6] = A * ht + P * At + z * ue + U * me, c[10] = A * $ + P * jt + z * de + U * re, c[14] = A * ft + P * Nt + z * ae + U * ne, c[3] = Y * ot + mt * ut + gt * Ot + dt * pe, c[7] = Y * ht + mt * At + gt * ue + dt * me, c[11] = Y * $ + mt * jt + gt * de + dt * re, c[15] = Y * ft + mt * Nt + gt * ae + dt * ne, this
        }
        makePerspective(t, i, r, n, c, d) {
          d === void 0 && console.warn("THREE.Matrix4: .makePerspective() has been redefined and has a new signature. Please check the docs.");
          const m = this.data,
            f = 2 * c / (i - t),
            w = 2 * c / (r - n),
            y = (i + t) / (i - t),
            x = (r + n) / (r - n),
            S = -(d + c) / (d - c),
            R = -2 * d * c / (d - c);
          return m[0] = f, m[4] = 0, m[8] = y, m[12] = 0, m[1] = 0, m[5] = w, m[9] = x, m[13] = 0, m[2] = 0, m[6] = 0, m[10] = S, m[14] = R, m[3] = 0, m[7] = 0, m[11] = -1, m[15] = 0, this
        }
        makeOrthographic(t, i, r, n, c, d) {
          const m = this.data,
            f = 1 / (i - t),
            w = 1 / (r - n),
            y = 1 / (d - c),
            x = (i + t) * f,
            S = (r + n) * w,
            R = (d + c) * y;
          return m[0] = 2 * f, m[4] = 0, m[8] = 0, m[12] = -x, m[1] = 0, m[5] = 2 * w, m[9] = 0, m[13] = -S, m[2] = 0, m[6] = 0, m[10] = -2 * y, m[14] = -R, m[3] = 0, m[7] = 0, m[11] = 0, m[15] = 1, this
        }
        mul2(t, i) {
          const r = t.data,
            n = i.data,
            c = this.data,
            d = r[0],
            m = r[1],
            f = r[2],
            w = r[3],
            y = r[4],
            x = r[5],
            S = r[6],
            R = r[7],
            A = r[8],
            P = r[9],
            z = r[10],
            U = r[11],
            Y = r[12],
            mt = r[13],
            gt = r[14],
            dt = r[15];
          let ot, ht, $, ft;
          return ot = n[0], ht = n[1], $ = n[2], ft = n[3], c[0] = d * ot + y * ht + A * $ + Y * ft, c[1] = m * ot + x * ht + P * $ + mt * ft, c[2] = f * ot + S * ht + z * $ + gt * ft, c[3] = w * ot + R * ht + U * $ + dt * ft, ot = n[4], ht = n[5], $ = n[6], ft = n[7], c[4] = d * ot + y * ht + A * $ + Y * ft, c[5] = m * ot + x * ht + P * $ + mt * ft, c[6] = f * ot + S * ht + z * $ + gt * ft, c[7] = w * ot + R * ht + U * $ + dt * ft, ot = n[8], ht = n[9], $ = n[10], ft = n[11], c[8] = d * ot + y * ht + A * $ + Y * ft, c[9] = m * ot + x * ht + P * $ + mt * ft, c[10] = f * ot + S * ht + z * $ + gt * ft, c[11] = w * ot + R * ht + U * $ + dt * ft, ot = n[12], ht = n[13], $ = n[14], ft = n[15], c[12] = d * ot + y * ht + A * $ + Y * ft, c[13] = m * ot + x * ht + P * $ + mt * ft, c[14] = f * ot + S * ht + z * $ + gt * ft, c[15] = w * ot + R * ht + U * $ + dt * ft, this
        }
        mul(t) {
          return this.mul2(this, t)
        }
        setTRS(t, i, r) {
          var n, c, d, m, f, w, y, x, S, R, A, P, z, U, Y, mt, gt, dt, ot, ht, $, ft, ut;
          return n = t.x, c = t.y, d = t.z, m = i.x, f = i.y, w = i.z, y = i.w, x = r.x, S = r.y, R = r.z, A = m + m, P = f + f, z = w + w, U = m * A, Y = m * P, mt = m * z, gt = f * P, dt = f * z, ot = w * z, ht = y * A, $ = y * P, ft = y * z, ut = this.data, ut[0] = (1 - (gt + ot)) * x, ut[1] = (Y + ft) * x, ut[2] = (mt - $) * x, ut[3] = 0, ut[4] = (Y - ft) * S, ut[5] = (1 - (U + ot)) * S, ut[6] = (dt + ht) * S, ut[7] = 0, ut[8] = (mt + $) * R, ut[9] = (dt - ht) * R, ut[10] = (1 - (U + gt)) * R, ut[11] = 0, ut[12] = n, ut[13] = c, ut[14] = d, ut[15] = 1, this
        }
        toJSON() {
          return Array.from(this.data)
        }
      }

      function Wr(l, t) {
        l = l.split("."), t = t.split(".");
        const i = Math.max(l.length, t.length);
        for (; l.length < i;) l.push("0");
        for (; t.length < i;) t.push("0");
        for (let r = 0; r < i; r++) {
          const n = parseInt(l[r]),
            c = parseInt(t[r]);
          if (n > c) return 1;
          if (n < c) return -1
        }
        return 0
      }

      function Kr(l) {
        return Wr(l, "4.3") >= 0
      }

      function $e(l, t) {
        if (!l) throw new Error(t)
      }

      function _a(l, t, i) {
        let r = 0;
        return function (...n) {
          if (Date.now() - r > t) return r = Date.now(), l.apply(i, n)
        }
      }
      const Se = {
        globalUrl: "https://global.easyar.cn",
        arocUrl: "https://aroc-api.easyar.com",
        clsUrl: "https://cls-api.easyar.com",
        uacUrl: "https://uac.easyar.com",
        clsV3Url: "https://clsv3-api.easyar.com",
        emaUrl: "https://large-spatialmaps.easyar.com"
      };

      function Yr(l, t) {
        return t && [Se.clsV3Url, Se.clsUrl].indexOf(t) < 0 ? t : Kr(l) ? Se.clsV3Url : Se.clsUrl
      }
      var Ee = null;

      function fa(l) {
        Ee = l
      }

      function Xr(l) {
        return Ee(`${Se.globalUrl}/anonymous/cls/${l}`, "GET", {}, null, null)
      }

      function Qr(l, t, i) {
        return Ee(`${l}/cls/arannotations`, "GET", {
          appId: t,
          pageNum: 1,
          pageSize: 100
        }, {
          authorization: i
        }, null)
      }

      function Jr(l, t, i, r) {
        return Ee(`${l}/cls/arannotation/${t}`, "GET", {
          appId: i
        }, {
          authorization: r
        }, null)
      }

      function Zr(l, t) {
        return Ee("https://clsv3-api.easyar.com/cls/client/mega/info", "GET", {
          appId: l
        }, {
          authorization: t
        }, null)
      }
      const ya = {};
      async function wa(l, t) {
        return `https://clsv3-api.easyar.com/${ya[l]?ya[l]:(await Zr(l,t)).path}`
      }

      function tn(l) {
        let t = JSON.stringify(l);
        return Ee("https://posefusion.easyar.com/pose/v1", "POST", null, null, t)
      }
      async function en(l, t, i, r, n) {
        let c = Object.keys(i || {}),
          d = c.length ? c.map(f => `${f}=${encodeURIComponent(i[f])}`).join("&") : void 0,
          m = {
            url: l + (d ? `?${d}` : ""),
            method: t,
            headers: {},
            data: void 0
          };
        return r && (m.headers = r), n && (m.data = n), new Promise((f, w) => {
          my.request({
            ...m,
            success: y => f(y.data),
            fail: y => w(y)
          })
        })
      }
      async function sn(l, t, i, r, n) {
        let c = Object.keys(i || {}),
          d = c.length ? c.map(f => `${f}=${encodeURIComponent(i[f])}`).join("&") : void 0,
          m = {
            url: l + (d ? `?${d}` : ""),
            method: t,
            header: {},
            data: void 0
          };
        return r && (m.header = r), n && (m.data = n), new Promise((f, w) => {
          wx.request({
            ...m,
            success: y => f(y.data),
            fail: y => w(y)
          })
        })
      }
      class li {
        constructor() {
          this._callbacks = {}, this._callbackActive = {}
        }
        initEventHandler() {
          this._callbacks = {}, this._callbackActive = {}
        }
        _addCallback(t, i, r, n = !1) {
          !t || typeof t != "string" || !i || (this._callbacks[t] || (this._callbacks[t] = []), this._callbackActive[t] && this._callbackActive[t] === this._callbacks[t] && (this._callbackActive[t] = this._callbackActive[t].slice()), this._callbacks[t].push({
            callback: i,
            scope: r || this,
            once: n
          }))
        }
        on(t, i, r) {
          return this._addCallback(t, i, r, !1), this
        }
        off(t, i, r) {
          if (t) this._callbackActive[t] && this._callbackActive[t] === this._callbacks[t] && (this._callbackActive[t] = this._callbackActive[t].slice());
          else
            for (const n in this._callbackActive) !this._callbacks[n] || this._callbacks[n] === this._callbackActive[n] && (this._callbackActive[n] = this._callbackActive[n].slice());
          if (!t) this._callbacks = {};
          else if (!i) this._callbacks[t] && (this._callbacks[t] = []);
          else {
            const n = this._callbacks[t];
            if (!n) return this;
            let c = n.length;
            for (let d = 0; d < c; d++) n[d].callback === i && (r && n[d].scope !== r || (n[d--] = n[--c]));
            n.length = c
          }
          return this
        }
        fire(t, ...i) {
          if (!t || !this._callbacks[t]) return this;
          let r;
          this._callbackActive[t] ? (this._callbackActive[t] === this._callbacks[t] && (this._callbackActive[t] = this._callbackActive[t].slice()), r = this._callbacks[t].slice()) : this._callbackActive[t] = this._callbacks[t];
          for (let n = 0;
            (r || this._callbackActive[t]) && n < (r || this._callbackActive[t]).length; n++) {
            const c = (r || this._callbackActive[t])[n];
            if (c.callback.call(c.scope, ...i), c.once) {
              const d = this._callbacks[t],
                m = d ? d.indexOf(c) : -1;
              m !== -1 && (this._callbackActive[t] === d && (this._callbackActive[t] = this._callbackActive[t].slice()), this._callbacks[t].splice(m, 1))
            }
          }
          return r || (this._callbackActive[t] = null), this
        }
        once(t, i, r) {
          return this._addCallback(t, i, r, !0), this
        }
        hasEvent(t) {
          return this._callbacks[t] && this._callbacks[t].length !== 0 || !1
        }
      }

      function an(l) {
        let t = new ts("SHA-256", "TEXT");
        return t.update(l), t.getHash("HEX")
      }
      let Ti = {},
        gs = {};

      function rn(l, t, i) {
        if (!l) return Promise.reject("apiKey undefined");
        if (!t) return Promise.reject("apiSecret undefined");
        if (!i) return Promise.reject("appId undefined");
        let r = new Date().getTime();
        if (gs[l] && r < gs[l] && Ti[l]) return Promise.resolve(Ti[l]);
        const n = 3600;
        gs[l] = r + n * 1e3;
        const c = `[{"service":"ecs:cls","effect":"Allow","resource":["${i}"],"permission":["READ","WRITE"]}]`;
        let d = {
            expires: n,
            timestamp: r,
            apiKey: l,
            acl: c
          },
          m = Object.keys(d).sort().map(f => `${f}${d[f]}`).concat(t).join("");
        return d.signature = an(m), Ee(`${Se.uacUrl}/token/v2`, "POST", null, null, d).then(f => f.result && f.result.token ? (Ti[l] = f.result.token, Ti[l]) : (console.error("token error"), "TOKEN_ERROR"))
      }
      class _s extends li {
        constructor(t) {
          super(), this.clsdata = {}, $e(t.apiKey, "apiKey \u4E0D\u4E3A\u7A7A"), $e(t.apiSecret, "apiSecret \u4E0D\u4E3A\u7A7A"), $e(t.clsAppId, "clsAppId \u4E0D\u4E3A\u7A7A"), this.config = t, this.config.useCache === void 0 && (this.config.useCache = !0), t.serverConfig && Object.assign(Se, t.serverConfig), this.clsdata = {}
        }
        setConfig(t, i) {
          i = i || this.config.clsAppId != t.clsAppId, $e(t.apiKey, "apiKey \u4E0D\u4E3A\u7A7A"), $e(t.apiSecret, "apiSecret \u4E0D\u4E3A\u7A7A"), $e(t.clsAppId, "clsAppId \u4E0D\u4E3A\u7A7A"), Object.assign(this.config, t), t.serverConfig && Object.assign(Se, t.serverConfig), i && (this.clsdata = {})
        }
        getConfig() {
          return this.config
        }
        async getToken() {
          return this.token = await rn(this.config.apiKey, this.config.apiSecret, this.config.clsAppId), this.token
        }
        async getVersion() {
          if (this.config.useCache && this.clsdata.clsVersion) return this.clsdata.clsVersion;
          const t = await Xr(this.config.clsAppId);
          return this.clsdata.clsVersion = t.version, this.clsdata.clsVersion
        }
        async getClsHost() {
          return this.config.useCache && this.clsdata.clsHost ? this.clsdata.clsHost : (await this.getVersion(), this.clsdata.clsHost = Yr(this.clsdata.clsVersion), this.clsdata.clsHost)
        }
        async getArannotations() {
          if (this.config.useCache && this.clsdata.arannotations) return this.clsdata.arannotations;
          await this.getToken(), await this.getClsHost();
          let t = await Qr(this.clsdata.clsHost, this.config.clsAppId, this.token),
            {
              arannotations: i
            } = t.result;
          return this.clsdata.arannotations = i, this.clsdata.arannotations
        }
        async getArannotationsDetail() {
          if (this.config.useCache && this.clsdata.arannotationsDetail) return this.clsdata.arannotationsDetail;
          const t = await this.getArannotations(),
            i = await Promise.all(t.map(r => this._getEmaByArannotaionId(r.arannotationId)));
          return Object.assign(this.clsdata, {
            arannotationsDetail: i
          }), this.clsdata
        }
        async getArannotationDetail(t, i) {
          i || (i = {
            ema: !0,
            meta: !0
          });
          const r = await this.getArannotations();
          t = t != null ? t : this.config.arannotationId, $e(t, "arannotationId\u4E0D\u80FD\u4E3A\u7A7A");
          let n = r.find(d => d.arannotationId == t);
          if (!n) return Promise.reject("arannotationId\u4E0D\u5B58\u5728");
          let c = await this._getEmaByArannotaionId(n.arannotationId, i);
          return Object.assign(this.clsdata, c), this.clsdata
        }
        async _getEmaByArannotaionId(t, i) {
          i || (i = {
            ema: !0,
            meta: !0
          });
          let r = await Jr(this.clsdata.clsHost, t, this.config.clsAppId, this.token),
            n = {
              ema: null,
              meta: null,
              emaClusters: null,
              emaBlocks: null,
              emaMaps: null,
              emaRelationships: null
            };
          const c = i.ema && r.result.emaUrl ? Ee(r.result.emaUrl.replace("https://large-spatialmaps.easyar.com", Se.emaUrl || "/api/large-spatialmaps"), "GET", null, {
              "content-type": " "
            }, null).then(m => (n.ema = m, m)) : Promise.resolve(),
            d = i.meta && r.result.metaUrl ? Ee(r.result.metaUrl, "GET", null, {
              "content-type": " "
            }, null).then(m => (n.meta = m, m)) : Promise.resolve();
          return await Promise.all([c, d]), n
        }
        destroy() {
          this.off(), this.clsdata = null
        }
      }
      const Qe = class {
        constructor() {
          this._isAC = !1, this.frames = [], this.debugFusions = [], this.lastFrameTs = 0, this.lastVio = [], this._enable = !0, this.poseFusions = [], this.localFusion = null, this.currentFusion = null, this.lastFusion = null, this.poseFusionResult = null
        }
        static get instance() {
          return this._instance || (this._instance = new Qe), this._instance
        }
        get isAC() {
          return this._isAC
        }
        set isAC(l) {
          this._isAC != l && (this.currentFusion = null, this.poseFusionResult = null, this._isAC = l, this._enable = !l)
        }
        get enable() {
          return this._enable
        }
        set enable(l) {
          this._isAC || this._enable != l && (l ? (this.currentFusion = null, this.poseFusionResult = null, this._updateCurrentFusion()) : this._updateLocalFusion(), this._enable = l)
        }
        insertData(l, t, i) {
          let r = {
            localTwc: {
              data: l
            },
            mapTcw: {
              data: t
            },
            timestamp: i
          };
          this.poseFusions.push(r);
          let n = 0;
          for (; r.timestamp - this.poseFusions[n].timestamp > 90;) n++;
          return n > 0 && (this.poseFusions = this.poseFusions.slice(n)), this._isAC ? this._updateACFusion() : this._enable ? this._updateCurrentFusion() : this._updateLocalFusion()
        }
        _updateLocalFusion() {
          return this.poseFusions.length < 1 ? Promise.reject("poseFusion empty") : new Promise((l, t) => {
            const i = this.poseFusions[this.poseFusions.length - 1],
              {
                localTwc: r,
                mapTcw: n
              } = i;
            this.localFusion = new Ut().mul2(new Ut().set(r.data).transpose(), new Ut().set(n.data).transpose()), l(null)
          })
        }
        _updateCurrentFusion() {
          return this.poseFusions.length < 1 ? Promise.reject("poseFusion empty") : tn(this.poseFusions).then(l => {
            const t = this.poseFusionResult ? this.poseFusionResult : l.result;
            if (this.poseFusionResult = l.result, this.poseFusionResult.status < t.status || this.poseFusionResult.timestamp < t.timestamp) return;
            const i = new Ut().set(this.poseFusionResult.transform.data).transpose().clone().getInverse(),
              r = this.currentFusion ? this.currentFusion : i,
              n = i;
            this.isSlerp = !Qe.sim3DifferenceIsTooBig(r, n), this.isSlerp && (this.sFusion = this.sFusion ? this.sFusion : r, this.lastFusion = this.sFusion, this.slerpTimestamp = new Date().getTime()), this.currentFusion = n
          })
        }
        _updateACFusion() {
          return this.poseFusions.length < 1 ? Promise.reject("poseFusion empty") : new Promise((l, t) => {
            const {
              localTwc: i,
              mapTcw: r
            } = this.poseFusions[this.poseFusions.length - 1];
            this.localFusion = new Ut().mul2(new Ut().set(i.data).transpose(), new Ut().set(r.data).transpose()), this.sFusion = this.sFusion || this.localFusion, this.lastFusion = this.sFusion, l(null)
          })
        }
        getPoseInMap(l, t, i = 0) {
          if (this._isAC) return this.getACPose(l, t, i);
          const r = this._enable && this.currentFusion ? this.currentFusion : this.localFusion;
          if (!r) return null;
          if (this._enable && this.isSlerp) {
            const c = (new Date().getTime() - this.slerpTimestamp) / 1e3,
              d = Math.min(1, c);
            this.sFusion = Qe.averageResult(this.lastFusion, r, d)
          } else this.sFusion = r;
          let n = new Ut().mul2(new Ut().set(l), this.sFusion.clone()).getInverse();
          return this.norm(n.data)
        }
        getACPose(l, t, i = 0) {
          const r = Array.from(new Ut().set(l).transpose().getInverse().data);
          this.insertFrames(t, i, r);
          const n = this.localFusion;
          if (!n) return null;
          let c = null;
          if (this.poseFusions.length < 2 || Qe.sim3DifferenceIsTooBig(this.lastFusion, n)) this.sFusion = n;
          else {
            const d = this.poseFusions[this.poseFusions.length - 1].timestamp,
              m = t - d,
              f = Math.min(1, m);
            this.sFusion = Qe.averageResult(this.lastFusion, n, f)
          }
          return c = new Ut().mul2(new Ut().set(l), this.sFusion.clone()).getInverse(), this.norm(c.data)
        }
        norm(l) {
          const t = Math.sqrt(l[0] * l[0] + l[4] * l[4] + l[8] * l[8]),
            i = l.map((r, n) => n < 12 && n % 4 < 3 ? r / t : r);
          return i[15] = 1, i
        }
        clearFusion() {
          this.poseFusions = [], this.debugFusions = [], this.frames = [], this.poseFusionResult = null, this.lastFrameTs = 0, this.lastVio = [], this.currentFusion = null, this.localFusion = null
        }
        clearFrames() {
          this.frames = []
        }
        getFrames() {
          return this.frames
        }
        insertFrames(l, t, i) {
          this.frames.push({
            rotate: `${t}`,
            frameTimestamp: `${l}`,
            vioPose: i.map(r => `${r}`),
            trackingStatus: "2"
          }), this.frames.length > 120 && (this.frames = this.frames.slice(120))
        }
        insertDebug(l, t, i, r, n = "") {
          this.debugFusions.push({
            localTwc: l,
            mapTcw: t,
            timestamp: i,
            cameraParam: `${JSON.stringify(r)}}`,
            base64: n,
            fusionPoses: []
          })
        }
        getDebug() {
          return this.debugFusions
        }
        detectVioJumps(l, t) {
          if (this.lastFrameTs == 0 || this.lastVio.length == 0) return this.lastFrameTs = t, this.lastVio = l, !1;
          let i = !0;
          const r = {
              x: this.lastVio[3],
              y: this.lastVio[7],
              z: this.lastVio[11]
            },
            n = {
              x: l[3],
              y: l[7],
              z: l[11]
            },
            c = {
              x: r.x - n.x,
              y: r.y - n.y,
              z: r.z - n.z
            },
            d = Math.sqrt(c.x * c.x + c.y * c.y + c.z * c.z),
            m = t - this.lastFrameTs;
          return m < 1e-7 && (i = !1), i && (d / m > 6 || d > 3) && this.clearFusion(), this.lastFrameTs = t, this.lastVio = l, i
        }
        static sim3DifferenceIsTooBig(l, t) {
          const i = l.decompose(),
            r = t.decompose(),
            n = i.rotation.getInverse().mul(r.rotation).data;
          let c = (n[0] + n[5] + n[10] + n[15] - 1.000001) / 2;
          c >= 1 && (c = 1), c <= -1 && (c = -1);
          const d = Math.acos(c) * 180 / Math.PI,
            m = {
              x: i.position.x - r.position.x,
              y: i.position.y - r.position.y,
              z: i.position.z - r.position.z
            };
          return Math.sqrt(m.x * m.x + m.y * m.y + m.z * m.z) > 5 || d > 90
        }
        static averageResult(l, t, i) {
          const r = l.decompose(),
            n = t.decompose(),
            c = new ms().setFromMat4(l),
            d = new ms().setFromMat4(t),
            m = new Me(r.position.x * (1 - i) + n.position.x * i, r.position.y * (1 - i) + n.position.y * i, r.position.z * (1 - i) + n.position.z * i),
            f = new Me(r.scale.x * (1 - i) + n.scale.x * i, r.scale.y * (1 - i) + n.scale.y * i, r.scale.z * (1 - i) + n.scale.z * i),
            w = new ms().slerp(c, d, i);
          return w.w = -w.w, new Ut().setTRS(m, w, f)
        }
      };
      let Yt = Qe;
      Yt._instance = null;
      const nn = {
        normal: "2",
        notAvailable: "0"
      };
      class fs extends _s {
        constructor(t) {
          var i;
          super(t), this._interval = 1e3, this._worldMatrix = null, this._arSessionId = "";
          let r = (i = this.config.serverConfig) != null && i.cloudUrl ? this.config.serverConfig.cloudUrl + "/file/localize" : null;
          r ? (this._clsUrl = r, this.fire("clsLoaded", this), t.autoStart && this.start()) : this.getToken().then(async () => {
            r = await wa(this.config.clsAppId, this.token), this._clsUrl = r, r.indexOf("/ext") > 0 ? Yt.instance.isAC = !0 : Yt.instance.isAC = !1, this.fire("clsLoaded", this), t.autoStart && this.start()
          }), t.arannotationId && this.getArannotationDetail(t.arannotationId, {
            ema: !0,
            meta: !1
          }).then(n => {
            this.fire("emaLoaded", n)
          })
        }
        get currentBlockId() {
          var t, i, r;
          return this._curLocalizerRes ? (t = this._curLocalizerRes) != null && t.blockId ? (i = this._curLocalizerRes) == null ? void 0 : i.blockId : (r = this._curLocalizerRes) == null ? void 0 : r.mapId : null
        }
        get currentBlockName() {
          var t;
          return this._curLocalizerRes ? (t = this._curLocalizerRes) == null ? void 0 : t.name : null
        }
        get offsetMatrix() {
          return Yt.instance.currentFusion.data
        }
        get worldMatrix() {
          return this._worldMatrix
        }
        updateFrame(t) {
          if (this._inLoop && this._request && this._request(t), this._curLocalizerRes && t.camera.trackingState == "normal") {
            let i = new Ut().set(t.camera.transform).getInverse().data;
            this._worldMatrix = Yt.instance.getPoseInMap(i, Date.now() / 1e3)
          }
        }
        setGPS(t) {}
        setConfig(t, i) {
          var r;
          super.setConfig(t, i), this.clearFusion();
          let n = (r = this.config.serverConfig) != null && r.cloudUrl ? this.config.serverConfig.cloudUrl + "/file/localize" : null;
          n ? (this._clsUrl = n, this.fire("clsLoaded", this), t.autoStart && this.start()) : this.getToken().then(async () => {
            n = await wa(this.config.clsAppId, this.token), this._clsUrl = n, n.indexOf("/ext") > 0 ? Yt.instance.isAC = !0 : Yt.instance.isAC = !1, this.fire("clsLoaded", this), t.autoStart && this.start()
          }), t.arannotationId && this.getArannotationDetail(t.arannotationId, {
            ema: !0,
            meta: !1
          }).then(c => {
            this.fire("emaLoaded", c)
          })
        }
        clearFusion() {
          Yt.instance.clearFusion(), this._arSessionId = ""
        }
        start(t) {
          this._inLoop || (this._inLoop = !0, t && (this._interval = t), this._request = _a(this.localizeOnce, this._interval, this))
        }
        stop() {
          this._inLoop = !1
        }
        pause() {
          !this._inLoop || (this._inLoop = !1)
        }
        resume() {
          this._inLoop || (this._request || this.start(), this._inLoop = !0)
        }
        getPoseInBlock(t) {
          let i = new Ut().set(t).getInverse().data;
          return Yt.instance.getPoseInMap(i)
        }
        async localizeOnce(t) {
          if (this._busy) return;
          this._busy = !0;
          const i = t.capturedImage,
            r = t.width,
            n = t.height,
            c = t.camera.intrinsics,
            d = c[0],
            m = c[4],
            f = c[6],
            w = c[7],
            y = [d, m, f, w],
            x = 960 / r,
            S = n * x,
            R = 960,
            A = m * x,
            P = d * x,
            z = w * x,
            U = f * x,
            Y = [A, P, z, U].map($ => $.toString()),
            mt = t.camera.transform.slice();
          var gt = [];
          for (let $ = 0; $ < 4; $++) gt[$] = mt[4 * $], gt[$ + 4] = mt[4 * $ + 1], gt[$ + 8] = mt[4 * $ + 2], gt[$ + 12] = mt[4 * $ + 3];
          let dt = Date.now();
          const ot = {
              appId: this.config.clsAppId,
              apiKey: this.config.apiKey,
              timestamp: dt,
              cameraParam: y,
              apiSecret: this.config.apiSecret,
              arSessionId: this._arSessionId,
              args: JSON.stringify({
                vioPose: gt.map($ => `${$}`),
                cameraParam: Y,
                rotate: "0",
                cameraSize: [S.toString(), R.toString()],
                frameTimestamp: t.timestamp.toString(),
                trackingStatus: nn[t.camera.trackingState],
                recentFrames: Yt.instance.getFrames()
              })
            },
            ht = this._clsUrl;
          return new Promise(($, ft) => {
            ExpAREngine.localize({
              url: ht,
              params: JSON.stringify(ot),
              image: i,
              width: r,
              height: n,
              complete: ut => {
                const At = JSON.parse(ut),
                  jt = JSON.parse(At.data);
                if (At.data = jt, At.status === 200) {
                  if (jt && jt.statusCode === 0) {
                    this._curLocalizerRes = jt.result[0], this._arSessionId = jt.arSessionId;
                    var Nt = [];
                    for (let Ot = 0; Ot < 4; Ot++) Nt[Ot] = t.camera.transform[4 * Ot], Nt[Ot + 4] = t.camera.transform[4 * Ot + 1], Nt[Ot + 8] = t.camera.transform[4 * Ot + 2], Nt[Ot + 12] = t.camera.transform[4 * Ot + 3];
                    Yt.instance.insertData(Nt, this._curLocalizerRes.pose, dt / 1e3).then(Ot => {
                      this.fire("localize_sucess", At.data), $(At)
                    })
                  } else this.fire("localize_fail", At.data), $(At);
                  this._busy = !1
                } else this.fire("localize_error", At), ft(At), this._busy = !1
              }
            })
          })
        }
        destroy() {
          super.destroy(), this.stop(), Yt._instance = null
        }
      }
      class ys extends _s {
        constructor(t) {
          super(t), this._interval = 1e3, this._curLocalizerRes = null, t.arannotationId && this.getArannotationDetail(t.arannotationId, {
            ema: !0,
            meta: !1
          }).then(i => {
            this.fire("emaLoaded", i)
          }), this.fire("clsLoaded", this), t.autoStart && this.start()
        }
        get currentBlockId() {
          var t;
          return (t = this._curLocalizerRes) == null ? void 0 : t.blockId
        }
        get offsetMatrix() {
          return Yt.instance.currentFusion.data
        }
        get worldMatrix() {
          return this._worldMatrix
        }
        get currentBlockName() {
          var t;
          return this._curLocalizerRes ? (t = this._curLocalizerRes) == null ? void 0 : t.name : null
        }
        updateFrame(t) {
          const {
            camera: i,
            timestamp: r,
            results: n
          } = t;
          if (this._inLoop && this._request && this._request(t), i.trackingStatus != -1 && n && n.length > 0) {
            const c = this.parseMegaResult(n);
            if (c) {
              this._curLocalizerRes === null ? this._curLocalizerRes = c : this._curLocalizerRes.name != c.name && (this._curLocalizerRes = c);
              let d = new Ut().set(c.pose).getInverse();
              d.mul2(new Ut().set([0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]), d), this._worldMatrix = d.transpose().data
            }
          }
        }
        setGPS(t) {}
        setConfig(t, i) {
          super.setConfig(t, i), this.clearFusion(), t.arannotationId && this.getArannotationDetail(t.arannotationId, {
            ema: !0,
            meta: !1
          }).then(r => {
            this.fire("emaLoaded", r)
          })
        }
        clearFusion() {
          Yt.instance.clearFusion()
        }
        start(t) {
          this._inLoop || (this._inLoop = !0, t && (this._interval = t), this._request = _a(this.localizeOnce, this._interval, this))
        }
        stop() {
          this._inLoop = !1
        }
        resume() {
          this._inLoop || (this._request || this.start(), this._inLoop = !0)
        }
        pause() {
          !this._inLoop || (this._inLoop = !1)
        }
        getPoseInBlock(t) {
          let i = new Ut().set(t).getInverse().data;
          return Yt.instance.getPoseInMap(i)
        }
        async localizeOnce(t) {
          this._busy || (this._busy = !0, this._curLocalizerRes ? this.fire("localize_sucess", {
            statusCode: 0,
            msg: "Localization Scc",
            result: [this._curLocalizerRes]
          }) : this.fire("localize_fail", {
            statusCode: 17,
            msg: "Localization failed"
          }), this._busy = !1)
        }
        parseMegaResult(t) {
          const i = t.length;
          for (let r = 0; r < i; r++) {
            const n = t[r].instances,
              c = n.length;
            for (let d = 0; d < c; d++) return n[d]
          }
          return null
        }
      }
      var ve = (l => (l[l.Small = 640] = "Small", l[l.Normal = 960] = "Normal", l[l.Big = 1280] = "Big", l))(ve || {}),
        ce = (l => (l[l.Portrait = 0] = "Portrait", l[l.LandscapeLeft = 90] = "LandscapeLeft", l[l.PortraitUpsideDown = 180] = "PortraitUpsideDown", l[l.LandscapeRight = 270] = "LandscapeRight", l))(ce || {});
      class ws {
        constructor(t, i, r) {
          this.imageLongsideLength = 960, this.deviceOrientation = 0, this.remoteDebugFlag = !1, this.imageLongsideLength = t, this.deviceOrientation = i, this.remoteDebugFlag = r
        }
        static copyConstruct(t) {
          return new ws(t.imageLongsideLength, t.deviceOrientation, t.remoteDebugFlag)
        }
      }
      class on extends hs {
        constructor(t, i, r) {
          super(), this._imageLongsideLength = ve.Normal, this._deviceOrientation = ce.Portrait, this._legacyBlockServiceFlag = !1, this._vkframe = null, this._calibData = null, this.captureCanvas = null, this.captureCTX = null, this._capturePixelRatio = null, this._imageLongsideLength = i, this._deviceOrientation = r, this._arSessionCtrl = t, new Promise((n, c) => {
            this.captureCanvas = wx.createOffscreenCanvas({
              type: "2d",
              width: 720,
              height: 960
            });
            const d = setInterval(() => {
              if (this.captureCanvas) {
                this.captureCTX = this.captureCanvas.getContext("2d"), clearInterval(d), n(null);
                return
              }
              console.warn("try create capture canvas"), this.captureCanvas = wx.createOffscreenCanvas({
                type: "2d",
                width: 720,
                height: 960
              })
            }, 60)
          }), Ft.instance.getCalibData().then(n => {
            this._calibData = n
          })
        }
        set imageLongsideLength(t) {
          if (t != ve.Small && t != ve.Normal && t != ve.Big) {
            console.error(`Invalid imageLongsideLength : ${t}; It must be 640 or 960 or 1280`);
            return
          }
          this._imageLongsideLength = t
        }
        initialize() {
          this._initFlag = !0
        }
        dispose() {
          this._onFrameInput.dispose(), this.captureCanvas = null, this.captureCTX = null, this._initFlag = !1
        }
        onLegacyBlockService() {
          this._legacyBlockServiceFlag = !0
        }
        onFrameUpdate(...t) {
          if (this._vkframe == null) return;
          let i = null;
          this._arSessionCtrl.trackMode == o.Dof6 ? i = _t.SixDof : this._arSessionCtrl.trackMode == o.Dof3 ? i = _t.ThreeDofRotOnly : this._arSessionCtrl.trackMode == o.Camera && (i = _t.ZeroDof);
          const r = this._arSessionCtrl.curARSession.state == 1 && i == _t.SixDof ? ye.Tracking : ye.NotTracking,
            n = this._arSessionCtrl.curARSession.cameraSize.width,
            c = this._arSessionCtrl.curARSession.cameraSize.height;
          if (!this._capturePixelRatio) {
            this._capturePixelRatio = this._imageLongsideLength / this._arSessionCtrl.curARSession.cameraSize.height;
            let S = this._arSessionCtrl.curARSession.cameraSize.width * this._capturePixelRatio;
            S % 16 != 0 && (S = Math.ceil(S / 16) * 16, this._capturePixelRatio = S / this._arSessionCtrl.curARSession.cameraSize.width, this._imageLongsideLength = this._arSessionCtrl.curARSession.cameraSize.height * this._capturePixelRatio)
          }
          const d = this._capturePixelRatio;
          this.captureCanvas.width != n * d && (this.captureCanvas.width = n * d, this.captureCanvas.height = c * d);
          const m = this._vkframe.camera.intrinsics;
          let f;
          if (m) {
            const S = {
              width: n,
              height: c,
              fx: m[4],
              fy: m[0],
              cx: m[7],
              cy: m[6]
            };
            f = Xt.createFromCalibData(S, this._deviceOrientation, n * d, c * d), f.cameraOrientation = 0
          } else this._calibData ? f = Xt.createFromCalibData(this._calibData, this._deviceOrientation, n * d, c * d) : f = Xt.createDefault(n * d, c * d, this._imageLongsideLength, this._deviceOrientation), f.cameraOrientation = 0;
          const w = this._vkframe.timestamp / 1e9;
          is.copyArrayBufferToNumbers(this._vkframe.camera.viewMatrix);
          let y = new kt().setFromEulerAngles(0, 0, -f.getImageOrientation()),
            x = null;
          if (i == _t.SixDof || i == _t.ThreeDofRotOnly) {
            let S = new kt().set(this._arSessionCtrl._worldMatrix.data);
            x = new kt().mul2(S, y)
          } else i == _t.ZeroDof && (x = null);
          if (this._imageFlag) {
            this._imageFlag = !1;
            const S = this._onFrameInput;
            if (this._vkframe.getCameraJpgBuffer) {
              const R = this._vkframe.getCameraJpgBuffer(this.captureCanvas.width, this.captureCanvas.height, .7),
                A = new Xe(r, i, f, w, x, null, R);
              S.fire(A)
            } else {
              const R = this.captureCanvas,
                A = this._vkframe.getCameraBuffer(this.captureCanvas.width, this.captureCanvas.height);
              let P = this.captureCTX,
                z = R.createImageData(new Uint8ClampedArray(A), this.captureCanvas.width, this.captureCanvas.height);
              P.putImageData(z, 0, 0), new Promise(U => {
                setTimeout(() => {
                  U(R.toDataURL("image/jpeg", .7))
                })
              }).then(U => {
                const Y = new Xe(r, i, f, w, x, U);
                S.fire(Y)
              }), console.warn("\u8BF7\u5347\u7EA7\u5FAE\u4FE1\u4EE5\u83B7\u53D6\u66F4\u597D\u7684\u6027\u80FD")
            }
          } else {
            const S = new Xe(r, i, f, w, x);
            this._onFrameInput.fire(S)
          }
        }
        onDeviceOrientationChange(t) {
          if (t != ce.Portrait && t != ce.PortraitUpsideDown && t != ce.LandscapeLeft && t != ce.LandscapeRight) throw new Error(`Invalid deviceOrientation : ${t}; It must be 0, 90, 180 or 270`);
          this._deviceOrientation = t
        }
        setVKFrame(t) {
          this._vkframe = t
        }
      }
      class hn {
        constructor(t) {
          this.gl = t, this._dt = null, this._program = null, this._vao = null, this._vao_ext = null
        }
        get program() {
          return this._program
        }
        set program(t) {
          this._program = t
        }
        initGL() {
          this.initShader(), this.initVAO()
        }
        initShader() {
          const t = this.gl,
            i = t.getParameter(t.CURRENT_PROGRAM),
            r = `
        attribute vec2 a_position;
        attribute vec2 a_texCoord;
        uniform mat3 displayTransform;
        varying vec2 v_texCoord;
        void main() {
          vec3 p = displayTransform * vec3(a_position, 0.0);
          gl_Position = vec4(p, 1.0);
          v_texCoord = a_texCoord;
        }
      `,
            n = `
        precision highp float;

        uniform sampler2D y_texture;
        uniform sampler2D uv_texture;
        varying vec2 v_texCoord;
        void main() {
          vec4 y_color = texture2D(y_texture, v_texCoord);
          vec4 uv_color = texture2D(uv_texture, v_texCoord);

          float Y, U, V;
          float R ,G, B;
          Y = y_color.r;
          U = uv_color.r - 0.5;
          V = uv_color.a - 0.5;
          
          R = Y + 1.402 * V;
          G = Y - 0.344 * U - 0.714 * V;
          B = Y + 1.772 * U;
          
          gl_FragColor = vec4(R, G, B, 1.0);
        }
      `,
            c = t.createShader(t.VERTEX_SHADER);
          t.shaderSource(c, r), t.compileShader(c);
          const d = t.createShader(t.FRAGMENT_SHADER);
          t.shaderSource(d, n), t.compileShader(d);
          const m = this._program = t.createProgram();
          this._program.gl = t, t.attachShader(m, c), t.attachShader(m, d), t.deleteShader(c), t.deleteShader(d), t.linkProgram(m), t.useProgram(m);
          const f = t.getUniformLocation(m, "y_texture");
          t.uniform1i(f, 5);
          const w = t.getUniformLocation(m, "uv_texture");
          t.uniform1i(w, 6), this._dt = t.getUniformLocation(m, "displayTransform"), t.useProgram(i)
        }
        initVAO() {
          const t = this.gl,
            i = t.getExtension("OES_vertex_array_object");
          this._vao_ext = i;
          const r = t.getParameter(t.VERTEX_ARRAY_BINDING),
            n = i.createVertexArrayOES();
          i.bindVertexArrayOES(n);
          const c = t.getAttribLocation(this._program, "a_position"),
            d = t.createBuffer();
          t.bindBuffer(t.ARRAY_BUFFER, d), t.bufferData(t.ARRAY_BUFFER, new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]), t.STATIC_DRAW), t.vertexAttribPointer(c, 2, t.FLOAT, !1, 0, 0), t.enableVertexAttribArray(c), n.posBuffer = d;
          const m = t.getAttribLocation(this._program, "a_texCoord"),
            f = t.createBuffer();
          t.bindBuffer(t.ARRAY_BUFFER, f), t.bufferData(t.ARRAY_BUFFER, new Float32Array([1, 1, 0, 1, 1, 0, 0, 0]), t.STATIC_DRAW), t.vertexAttribPointer(m, 2, t.FLOAT, !1, 0, 0), t.enableVertexAttribArray(m), n.texcoordBuffer = f, i.bindVertexArrayOES(r), this._vao = n
        }
        renderGL(t) {
          const i = this.gl;
          i.disable(i.DEPTH_TEST);
          const {
            yTexture: r,
            uvTexture: n
          } = t.getCameraTexture(i), c = t.getDisplayTransform();
          if (r && n) {
            const d = i.getParameter(i.CURRENT_PROGRAM),
              m = i.getParameter(i.ACTIVE_TEXTURE),
              f = i.getParameter(i.VERTEX_ARRAY_BINDING);
            i.useProgram(this._program), this._vao_ext.bindVertexArrayOES(this._vao), i.uniformMatrix3fv(this._dt, !1, c), i.pixelStorei(i.UNPACK_ALIGNMENT, 1), i.activeTexture(i.TEXTURE0 + 5);
            const w = i.getParameter(i.TEXTURE_BINDING_2D);
            i.bindTexture(i.TEXTURE_2D, r), i.activeTexture(i.TEXTURE0 + 6);
            const y = i.getParameter(i.TEXTURE_BINDING_2D);
            i.bindTexture(i.TEXTURE_2D, n), i.drawArrays(i.TRIANGLE_STRIP, 0, 4), i.bindTexture(i.TEXTURE_2D, y), i.activeTexture(i.TEXTURE0 + 5), i.bindTexture(i.TEXTURE_2D, w), i.useProgram(d), i.activeTexture(m), this._vao_ext.bindVertexArrayOES(f)
          }
        }
        clearGL() {
          const t = this.gl;
          t.clearColor(0, 0, 0, 0), t.clear(t.COLOR_BUFFER_BIT), t.clear(t.DEPTH_BUFFER_BIT), t.clear(t.STENCIL_BUFFER_BIT)
        }
        destroy() {
          this._program && this._program.gl && (this.clearGL(), this._program.gl.deleteProgram(this._program), this._program = null, this.gl = null)
        }
      }
      /**
       * KalmanFilter
       * @class
       * @see {@link http://github.com/wouterbulten/kalmanjs}
       * @version Version: 1.0.0-beta
       * @copyright Copyright 2015-2018 Wouter Bulten
       * @license MIT License
       * @preserve
       */
      class vs {
        constructor({
          R: t = 1,
          Q: i = 1,
          A: r = 1,
          B: n = 0,
          C: c = 1
        } = {}) {
          this.R = t, this.Q = i, this.A = r, this.B = n, this.C = c, this.cov = void 0, this.x = void 0
        }
        filter(t, i = 0) {
          if (this.x === void 0) this.x = 1 / this.C * t, this.cov = 1 / this.C * this.Q * (1 / this.C);
          else {
            const r = this.predict(i),
              n = this.uncertainty(),
              c = n * this.C * (1 / (this.C * n * this.C + this.Q));
            this.x = r + c * (t - this.C * r), this.cov = n - c * this.C * n
          }
          return this.x
        }
        predict(t = 0) {
          if (this.x === void 0) throw new Error("Prediction cannot be made without initial measurement.");
          return this.A * this.x + this.B * t
        }
        uncertainty() {
          if (this.cov === void 0) throw new Error("Uncertainty cannot be calculated without initial measurement.");
          return this.A * this.cov * this.A + this.R
        }
        lastMeasurement() {
          return this.x
        }
        setMeasurementNoise(t) {
          this.Q = t
        }
        setProcessNoise(t) {
          this.R = t
        }
      }
      class va {
        constructor(t) {
          this.BUFFER_SIZE = 30, this.MIN_STEP_INTERVAL = 250, this.WINDOW_SIZE = 4, this.handleAccelerometerData = i => {
            let r = this.kalmanFilters[0].filter(i.x),
              n = this.kalmanFilters[1].filter(i.y),
              c = this.kalmanFilters[2].filter(i.z);
            this.detectStep({
              x: r,
              y: n,
              z: c
            }) && (this.stepCount++, g.log("step count:", this.stepCount), this.updatePosition())
          }, this.lashHandleAccelerometerDataTime = 0, this.pc = t, this.localPosition = new this.pc.Vec3, this.localRotation = new this.pc.Quat, this.localScale = new this.pc.Vec3(1, 1, 1), this.localPose = new this.pc.Mat4().setTRS(this.localPosition, this.localRotation, this.localScale), this.lastUpdateTime = Date.now(), this.stepCount = 0, this.stepLength = .7, this.externalRotation = null, this.accelerationBuffer = [], this.lastStepTime = 0, this.stepThreshold = .001, this.kalmanFilters = [new vs({
            R: .01,
            Q: .1
          }), new vs({
            R: .01,
            Q: .1
          }), new vs({
            R: .01,
            Q: .1
          })], this.initSensors()
        }
        initSensors() {
          wx.onAccelerometerChange(this.handleAccelerometerData)
        }
        destroy() {
          wx.offAccelerometerChange(this.handleAccelerometerData)
        }
        detectStep(t) {
          const i = Date.now();
          if (i - this.lashHandleAccelerometerDataTime < 20) return this.lashHandleAccelerometerDataTime = i, !1;
          const r = Math.abs(Math.sqrt(t.x ** 2 + t.y ** 2 + t.z ** 2) - 1);
          for (this.accelerationBuffer.push(r); this.accelerationBuffer.length > this.BUFFER_SIZE;) this.accelerationBuffer.shift();
          if (this.accelerationBuffer.length === this.BUFFER_SIZE && this.checkLocalMaximum(this.accelerationBuffer)) {
            const n = this.accelerationBuffer.reduce((c, d) => c + d) / this.BUFFER_SIZE;
            if (this.accelerationBuffer.reduce((c, d) => c + (d - n) ** 2, 0) / this.BUFFER_SIZE > this.stepThreshold && i - this.lastStepTime > this.MIN_STEP_INTERVAL) return this.lastStepTime = i, !0
          }
          return !1
        }
        checkLocalMaximum(t) {
          const i = Math.floor(this.BUFFER_SIZE / 2),
            r = t[i],
            n = t.slice(i - this.WINDOW_SIZE, i).reduce((w, y) => w + y) / this.WINDOW_SIZE,
            c = t.slice(i + 1, i + 1 + this.WINDOW_SIZE).reduce((w, y) => w + y) / this.WINDOW_SIZE,
            d = r > n && r > c,
            m = t[i - 1] - t[i - 2],
            f = t[i + 1] - t[i];
          return d && m > 0 && f < 0
        }
        updatePosition() {
          const t = new this.pc.Vec3(0, 0, -this.stepLength);
          this.localRotation.clone().transformVector(t, t), t.y = 0, this.lastLocalPosition || (this.lastLocalPosition = this.localPosition.clone()), this.localPosition.add(t.normalize().mulScalar(this.stepLength))
        }
        updateWithExternalRotation(t) {
          this.localRotation = t.clone()
        }
        updateWithWorldPose(t) {}
        getLocalPose() {
          if (!this.lastLocalPosition) return this.localPose.setTRS(this.localPosition, this.localRotation, this.localScale), this.localPose;
          const t = this.lastLocalPosition.lerp(this.lastLocalPosition, this.localPosition, .03);
          return this.localPose.setTRS(t, this.localRotation, this.localScale), this.localPose
        }
      }
      class xs extends Error {
        constructor(t, i) {
          super(i), this.type = t, this.name = "SensorError"
        }
      }
      class ks extends li {
        constructor() {
          super(...arguments), this.gyroDatas = [], this.accelDatas = [], this.orientationDatas = [], this.onAccelUpdate = t => {
            const i = Date.now();
            this.fire("accelUpdate", t, i), this.accelDatas.push({
              timestamp: i,
              data: [t.x * -10, t.y * -10, t.z * -10]
            }), this.accelDatas = this.accelDatas.filter(r => r.timestamp >= i - 2e3)
          }, this.onGyroUpdate = t => {
            const i = Date.now();
            this.fire("gyroUpdate", t, i), this.gyroDatas.push({
              timestamp: i,
              data: [t.x, t.y, t.z]
            }), this.gyroDatas = this.gyroDatas.filter(r => r.timestamp >= i - 2e3)
          }, this.onOriUpdate = t => {
            const i = Date.now();
            Ft.instance.isWeChat && Ft.instance.isAndroid && (t.alpha = -t.alpha, t.beta = -t.beta, t.gamma = -t.gamma), this.fire("orientationUpdate", t, i), this.orientationDatas.push({
              timestamp: i,
              data: [t.alpha, t.beta, t.gamma]
            }), this.orientationDatas = this.orientationDatas.filter(r => r.timestamp >= i - 2e3)
          }
        }
        start() {
          wx.startAccelerometer({
            interval: "game",
            success: () => {
              wx.onAccelerometerChange(this.onAccelUpdate)
            },
            fail: t => {
              this.fire("error", new xs("NOT_ALLOWED", t.errMsg))
            }
          }), wx.startGyroscope({
            interval: "game",
            success: () => {
              wx.onGyroscopeChange(this.onGyroUpdate)
            },
            fail: t => {
              this.fire("error", new xs("NOT_ALLOWED", t.errMsg))
            }
          }), wx.startDeviceMotionListening({
            interval: "game",
            success: () => {
              wx.onDeviceMotionChange(this.onOriUpdate)
            },
            fail: t => {
              this.fire("error", new xs("NOT_ALLOWED", t.errMsg))
            }
          })
        }
        stop() {
          wx.offAccelerometerChange(this.onAccelUpdate), wx.offGyroscopeChange(this.onGyroUpdate), wx.offDeviceMotionChange(this.onOriUpdate), wx.stopAccelerometer(), wx.stopGyroscope(), wx.stopDeviceMotionListening()
        }
      }

      function ln(l, t, i) {
        const r = cn(i);
        let n = Je(Ri(r.slice(1), t), xa(r[0], t)),
          c = Ri(r.slice(1), n);
        const d = Je(Je(c, c), t);
        return n = Je(Ri(r.slice(1), l), xa(r[0], l)), c = Ri(r.slice(1), n), [...Je(Je(c, c), l), ...d]
      }

      function Ri(l, t) {
        return [l[1] * t[2] - l[2] * t[1], l[2] * t[0] - l[0] * t[2], l[0] * t[1] - l[1] * t[0]]
      }

      function Je(l, t) {
        return l.map((i, r) => i + t[r])
      }

      function xa(l, t) {
        return t.map(i => i * l)
      }

      function cn(l) {
        const [t, i, r] = l.map(P => -P * Math.PI / 180), n = Math.cos(t / 2), c = Math.sin(t / 2), d = Math.cos(i / 2), m = Math.sin(i / 2), f = Math.cos(r / 2), w = Math.sin(r / 2), y = f * d * n - w * m * c, x = f * m * n + w * d * c, S = w * d * n - f * m * c, R = f * d * c - w * m * n, A = un([-x, -S, -R, y]);
        return A.unshift(A.pop()), A
      }

      function un(l) {
        const t = Math.sqrt(l[0] * l[0] + l[1] * l[1] + l[2] * l[2] + l[3] * l[3]);
        return l.map(i => i / t)
      }
      class ci extends li {
        constructor() {
          super(), this.session = null, this.modelLoaded = !1, this.sensors = null, this.running = !1, this.position = [0, 0], this.velocity = [0, 0], this.inferenceIntervalTime = 100, this.inferenceTime = 0, this.rotationData = [], this._inferenceIntvalId = -1, this._lastDebugTime = 0
        }
        static get instance() {
          return this._instance || (this._instance = new ci), this._instance
        }
        init(t, i) {
          if (this.pc = t, i) this.sensors = i;
          else {
            this.sensors = new ks;
            try {
              this.sensors.start(), this.fire("debug-msg", `sensor start
`)
            } catch (r) {
              throw this.fire("debug-msg", `Error in starting sensors
`), new Error(r)
            }
          }
          this.fire("inited", this)
        }
        async loadModel(t) {
          g.log("loadModel", t);
          const i = t.split("/").pop();
          let r = wx.env.USER_DATA_PATH + "/" + i,
            n = await new Promise((c, d) => {
              wx.getFileSystemManager().access({
                path: r,
                success: () => {
                  n = !0, c(!0)
                },
                fail: () => {
                  n = !1, c(!1)
                }
              })
            });
          g.log("modelExist", n), n || await new Promise((c, d) => {
            this.fire("debug-msg", `Downloading model
`), wx.downloadFile({
              url: t,
              filePath: r,
              success: m => {
                m.statusCode === 200 ? (this.fire("debug-msg", `Model downloaded
`), c(null)) : (this.fire("debug-msg", `Model download error
`), d(m))
              },
              fail: m => {
                this.fire("debug-msg", `Model download error
`), d(m)
              }
            })
          }), await new Promise((c, d) => {
            this.session = wx.createInferenceSession({
              model: r,
              precesionLevel: 4
            }), this.session.onLoad(() => {
              this.fire("debug-msg", `Model loaded
`), this.modelLoaded = !0, c(null)
            }), this.session.onError(m => {
              g.error("model load error", m), this.fire("debug-msg", `Model load error
`), d(m)
            })
          })
        }
        startInference() {
          this.running || (this.running = !0, this._inferenceIntvalId = setInterval(() => {
            !this.session || !this.modelLoaded || this.singleInference()
          }, this.inferenceIntervalTime))
        }
        stopInference() {
          !this.running || (this.running = !1, clearInterval(this._inferenceIntvalId))
        }
        async singleInference() {
          if (this.running) try {
            const t = Date.now();
            let i = this.getData(t - 1e3, t);
            if (!i) return;
            const r = new Float32Array(i),
              n = {
                shape: [1, 6, 200],
                data: r.buffer,
                type: "float32"
              },
              c = await this.session.run({
                "x.3": n
              }),
              d = new Float32Array(c[192].data);
            this.velocity = [d[0], d[1]];
            const m = [this.velocity[0] * this.inferenceIntervalTime / 1e3, this.velocity[1] * this.inferenceIntervalTime / 1e3];
            this.position = [this.position[0] + m[0], this.position[1] + m[1]], this.inferenceTime = Date.now() - t, this.fire("velocityUpdate", this.velocity, t), this.fire("positionUpdate", this.position, t), this.fire("inferenceTimeUpdate", this.inferenceTime, t), this.fire("inferenceResult", {
              velocity: this.velocity,
              position: this.position,
              inferenceTime: this.inferenceTime,
              timestamp: t
            }), Date.now() - this._lastDebugTime > 1e3
          } catch (t) {
            g.error(t), this.fire("error", t)
          }
        }
        getData(t, i = Date.now(), r = 200) {
          let n = [];
          const c = this.sensors,
            d = c.gyroDatas.filter(w => w.timestamp >= t - 500),
            m = c.accelDatas.filter(w => w.timestamp >= t - 500),
            f = c.orientationDatas.filter(w => w.timestamp >= t - 500);
          if (d.length === 0 || m.length === 0 || f.length === 0) return null;
          for (let w = 0; w < r; w++) {
            const y = t + w * (i - t) / r,
              x = this._interpolateData(d, y),
              S = this._interpolateData(m, y),
              R = this._interpolateData(f, y);
            n.push(ln(x, S, R))
          }
          return Date.now() - this._lastDebugTime > 1100 && (this._lastDebugTime = Date.now()), n = this._transpose(n), n.flat()
        }
        _interpolateData(t, i) {
          if (t.length === 0 && console.warn("No data available---"), t.length < 2) return t[0].data;
          let r = 0;
          for (r = 0; r < t.length && !(t[r].timestamp > i); r++);
          if (r === 0) return t[0].data;
          if (r === t.length) return t[t.length - 1].data;
          const n = t[r - 1],
            c = t[r],
            d = (i - n.timestamp) / (c.timestamp - n.timestamp);
          return n.data.map((m, f) => m + d * (c.data[f] - m))
        }
        _interpolateRotationData(t, i) {
          if (t.length === 0 && console.warn("No data available---"), t.length < 2) return t[0].data;
          let r = 0;
          for (r = 0; r < t.length && !(t[r].timestamp > i); r++);
          if (r === 0) return t[0].data;
          if (r === t.length) return t[t.length - 1].data;
          const n = t[r - 1],
            c = t[r],
            d = (i - n.timestamp) / (c.timestamp - n.timestamp);
          return new this.pc.Quat().slerp(n.data, c.data, d)
        }
        _processSensorData(t, i, r) {
          const n = r.transformVector(t),
            c = r.transformVector(i);
          return [n.x, n.y, n.z, c.x, c.y, c.z]
        }
        _transpose(t) {
          return t[0].map((i, r) => t.map(n => n[r]))
        }
        destroy() {
          var t, i, r;
          (t = this.session) == null || t.offError(), (i = this.session) == null || i.offLoad(), (r = this.session) == null || r.destroy(), this.session = null, this.modelLoaded = !1, this.off(), ci._instance = null
        }
      }
      class dn {
        constructor() {
          this.data = {}, this.recodeing = !1
        }
        start() {
          this.data = {}, this.recodeing = !0, this.sensors && (this.sensors.on("accelUpdate", this.onAccelUpdate, this), this.sensors.on("gyroUpdate", this.onGyroUpdate, this), this.sensors.on("orientationUpdate", this.onOriUpdate, this)), this.inferenceSessionManager && this.inferenceSessionManager.on("inferenceResult", this.onInferenceResult, this), this.app && (this.app.on("vioUpdate", this.onVioUpdate, this), this.app.on("inertailUpdate", this.onInertailUpdate, this))
        }
        onAccelUpdate(t, i) {
          !this.recodeing || (this.data.accel || (this.data.accel = []), this.data.accel.push({
            timestamp: i,
            data: t
          }))
        }
        onGyroUpdate(t, i) {
          !this.recodeing || (this.data.gyro || (this.data.gyro = []), this.data.gyro.push({
            timestamp: i,
            data: t
          }))
        }
        onOriUpdate(t, i) {
          !this.recodeing || (this.data.ori || (this.data.ori = []), this.data.ori.push({
            timestamp: i,
            data: t
          }))
        }
        onInferenceResult(t) {
          !this.recodeing || (this.data.inference || (this.data.inference = []), this.data.inference.push(t))
        }
        onVioUpdate(t) {
          !this.recodeing || (this.data.vio || (this.data.vio = []), this.data.vio.push(t))
        }
        onInertailUpdate(t) {
          !this.recodeing || (this.data.inertail || (this.data.inertail = []), this.data.inertail.push(t))
        }
        stop() {
          return this.sensors && (this.sensors.off("accelUpdate", this.onAccelUpdate, this), this.sensors.off("gyroUpdate", this.onGyroUpdate, this), this.sensors.off("orientationUpdate", this.onOriUpdate, this)), this.inferenceSessionManager && this.inferenceSessionManager.off("inferenceResult", this.onInferenceResult, this), this.app && (this.app.off("vioUpdate", this.onVioUpdate, this), this.app.off("inertailUpdate", this.onInertailUpdate, this)), this.recodeing = !1, JSON.parse(JSON.stringify(this.data))
        }
      }
      class je {
        constructor(t, i, r) {
          this.preferPDR = !1, this._cameraRenderMode = "towCanvas", this.pc = t, this.app = i, this._worldMatrix = new t.Mat4, this._projectMatrix = new t.Mat4, this._curPosition = new t.Vec3, this._targetPosition = new t.Vec3, this._viewWidth = r ? r.width : i.graphicsDevice.canvas.width, this._viewHeight = r ? r.height : i.graphicsDevice.canvas.height, this._near = .1, this._far = 1e3, r && this._cameraRenderMode == "towCanvas" ? this._cameraCanvas3d = r : (g.warn("\u4F7F\u7528 oneCanvas \u6A21\u5F0F\u5C06\u4F1A\u964D\u4F4E\u6027\u80FD,\u8BF7\u4F20\u5165\u7528\u4E8E\u7ED8\u5236\u76F8\u673A\u753B\u9762\u7684 canvas"), this._cameraRenderMode = "oneCanvas", this._cameraCanvas3d = wx.createOffscreenCanvas({
            type: "webgl",
            width: this._viewWidth,
            height: this._viewHeight
          })), this._cameraCanvasGl = this._cameraCanvas3d.getContext("webgl")
        }
        static canIUse(t = o.Dof6) {
          console.warn("\u8BE5\u63A5\u53E3\u5DF2\u542F\u7528\uFF0C\u8BF7\u4F7F\u7528 queryARSupport \u4EE3\u66FF\uFF0C\u5E76\u4F9D\u636E\u8FD4\u56DE\u503C\u8FDB\u884C\u5224\u5B9A");
          let i = null;
          switch (t) {
            case o.Camera:
              i = "v1";
              break;
            case o.Dof3:
              i = "v1";
              break;
            case o.Dof6:
              i = "v2";
              break
          }
          return Promise.resolve(wx.isVKSupport(i))
        }
        static async queryARSupport() {
          return Ft.instance.isIos ? (this.supportTrackMode = o.Dof6, Promise.resolve({
            arBaseMode: h.VKSession,
            arTrackMode: o.Dof6
          })) : Ft.instance.isSystemNotLessAndriod9 ? wx.isVKSupport("v2") ? (this.supportTrackMode = o.Dof6, Promise.resolve({
            arBaseMode: h.VKSession,
            arTrackMode: o.Dof6
          })) : (this.supportTrackMode = o.Dof3, Promise.resolve({
            arBaseMode: h.VKSession,
            arTrackMode: o.Dof3
          })) : (this.supportTrackMode = o.Dof3, Promise.resolve({
            arBaseMode: h.BaseCamera,
            arTrackMode: o.Dof3
          }))
        }
        create(t, i, r) {
          let n = null;
          const c = wx.isVKSupport("v2");
          switch (this.trackMode = t.trackMode, t.trackMode) {
            case o.Camera:
              n = "v1";
              break;
            case o.Dof3:
              n = "v1";
              break;
            case o.Dof6:
              n = "v2";
              break
          }
          if (n === "v2" && !c && (n = "v1", g.warn("\u5F53\u524D\u8BBE\u5907\u4E0D\u652F\u6301 v2 \u7248\u672C\u7684 AR,\u5DF2\u964D\u7EA7\u4E3A v1 3dof \u7248\u672C"), this.trackMode = o.Dof3, !wx.isVKSupport("v1"))) {
            g.warn("\u5F53\u524D\u8BBE\u5907\u4E0D\u652F\u6301 v1 \u7248\u672C\u7684 AR,\u65E0\u6CD5\u4F7F\u7528 AR \u529F\u80FD"), r && r();
            return
          }
          if (this.curARSession = wx.createVKSession({
              version: n,
              track: {
                plane: {
                  mode: 1
                },
                marker: t.trackImage,
                threeDof: n === "v1" && !t.trackImage
              },
              gl: this._cameraCanvasGl
            }), this.sensors = new ks, this.sensors.start(), this.sensors.on("orientationUpdate", d => {
              this._deviceMotion = d
            }, this), this.trackMode === o.Dof3) {
            this.inferenceSessionManager = ci.instance, this.inferenceSessionManager.init(this.pc, this.sensors);
            try {
              this.inferenceSessionManager.loadModel("https://sightp-tour-tiny-app.sightp.com/onnxModel/ronin_resnet.onnx").then(() => {
                this.inferenceSessionManager.startInference()
              }), this.inferenceSessionManager.on("positionUpdate", d => {
                this._targetPosition || (this._targetPosition = new this.pc.Vec3), this._targetPosition.set(d[0], 0, -d[1])
              }, this)
            } catch (d) {
              g.error("\u52A0\u8F7DNN\u6A21\u578B\u5931\u8D25", d), this.inferenceSessionManager.destroy(), this.inferenceSessionManager = null
            }
            this.pdrSystem = new va(this.pc)
          }
          this.dataRecoder = new dn, this.dataRecoder.app = this.app, this.dataRecoder.sensors = this.sensors, this.dataRecoder.inferenceSessionManager = this.inferenceSessionManager, i && i()
        }
        start(t, i, r) {
          this.curARSession.start(n => {
            n && (g.error("vksession start error:", n), i && i()), t && t(), this.yuv = new hn(this._cameraCanvasGl), this.yuv.initGL(), this.app.xr.session || (g.info("\u5173\u95ED App3d \u81EA\u52A8\u5237\u65B0"), this.app.xr = {
              session: {
                requestAnimationFrame: () => {}
              },
              end: () => {},
              destroy: () => {}
            });
            const c = () => {
              this._frameRequestId = this.curARSession.requestAnimationFrame(c), this.app.tick()
            };
            c()
          })
        }
        update() {
          const t = this.curARSession.getVKFrame(this._viewWidth, this._viewHeight);
          t && (this._curARFrame = t, this.updatePosition(), Jt.instance.clsClient && Jt.instance.clsClient.updateFrame(t), this.updateTexutre())
        }
        updateTexutre() {
          if (this.yuv.renderGL(this._curARFrame), this._cameraRenderMode != "towCanvas" && (this._textureRGBA || (this._textureRGBA = new this.pc.Texture(this.app.graphicsDevice, {
              width: this._viewWidth,
              height: this._viewHeight,
              format: this.pc.PIXELFORMAT_R8_G8_B8_A8,
              mipmaps: !1,
              addressU: this.pc.ADDRESS_CLAMP_TO_EDGE,
              addressV: this.pc.ADDRESS_CLAMP_TO_EDGE
            }), this._bgMaterial && (this._bgMaterial.setParameter("rgba_texture", this._textureRGBA), this._bgMaterial.update())), this._textureRGBA)) {
            let t = this._textureRGBA.lock();
            this._cameraCanvasGl.readPixels(0, 0, this._viewWidth, this._viewHeight, this._cameraCanvasGl.RGBA, this._cameraCanvasGl.UNSIGNED_BYTE, t), this._textureRGBA.unlock()
          }
        }
        updatePosition() {
          if (this._deviceMotion) {
            let t = this.rotationFromMotion(this._deviceMotion.alpha, this._deviceMotion.beta, this._deviceMotion.gamma);
            this._worldMatrix = new this.pc.Mat4().setTRS(new this.pc.Vec3(0, 0, 0), t, new this.pc.Vec3(1, 1, 1)), this.matrixFromDiveceMotion = this._worldMatrix.clone()
          } else this._worldMatrix.setIdentity();
          if (this.trackMode === o.Dof6) this.curARSession.state === 1 && (this.app.fire("vioUpdate", {
            timestamp: Date.now(),
            data: Array.from(new this.pc.Mat4().set(Array.from(this._curARFrame.camera.viewMatrix)).invert().data)
          }), this.matrixFromDiveceMotion && !this.offsetMatrix && (this.offsetMatrix = new this.pc.Mat4().mul2(this.matrixFromDiveceMotion, new this.pc.Mat4().set(Array.from(this._curARFrame.camera.viewMatrix)))), this.offsetMatrix ? this._worldMatrix = new this.pc.Mat4().mul2(this.offsetMatrix, new this.pc.Mat4().set(Array.from(this._curARFrame.camera.viewMatrix)).invert()) : this._worldMatrix.set(Array.from(this._curARFrame.camera.viewMatrix)).invert());
          else if (this.trackMode === o.Dof3) {
            if (this.matrixFromDiveceMotion) {
              const t = new this.pc.Mat4().mul2(this.matrixFromDiveceMotion, new this.pc.Mat4().set(Array.from(this._curARFrame.camera.viewMatrix)));
              if (!this.offsetMatrix) this.offsetMatrix = t;
              else {
                const i = new this.pc.Quat().setFromMat4(t),
                  r = new this.pc.Quat().setFromMat4(this.offsetMatrix),
                  n = i.x * r.x + i.y * r.y + i.z * r.z + i.w * r.w,
                  c = Math.min(Math.max(n, -1), 1);
                2 * Math.acos(Math.abs(c)) * (180 / Math.PI) < 10 && (r.slerp(r, i, .04), this.offsetMatrix.setTRS(new this.pc.Vec3, r, new this.pc.Vec3(1, 1, 1)))
              }
            }
            this.inferenceSessionManager && !this.pdrSystem ? (this._curPosition.lerp(this._curPosition, this._targetPosition, .03), this._worldMatrix.set(Array.from(this._curARFrame.camera.viewMatrix)).invert(), this.offsetMatrix && (this._worldMatrix = new this.pc.Mat4().mul2(this.offsetMatrix, this._worldMatrix)), this._worldMatrix.data[12] = this._curPosition.x, this._worldMatrix.data[13] = this._curPosition.y, this._worldMatrix.data[14] = this._curPosition.z, this.app.fire("inertailUpdate", {
              timestamp: Date.now(),
              data: Array.from(this._worldMatrix.data)
            })) : this.pdrSystem && (this.pdrSystem.updateWithExternalRotation(new this.pc.Quat().setFromMat4(this._worldMatrix)), this._worldMatrix = this.pdrSystem.getLocalPose())
          }
          this._projectMatrix.set(Array.from(this._curARFrame.camera.getProjectionMatrix(this._near, this._far)))
        }
        destroy() {
          this.pdrSystem && (this.pdrSystem.destroy(), this.pdrSystem = null), this.inferenceSessionManager && (this.inferenceSessionManager.destroy(), this.inferenceSessionManager = null), this.sensors && (this.sensors.stop(), this.sensors = null), this.curARSession && (this.curARSession.destroy(), this.curARSession = null), this.yuv && (this.yuv.destroy(), this.yuv = null), this._bgMaterial && (this._bgMaterial.destroy(), this._bgMaterial = null), this._curARFrame = null, this._cameraCanvas3d = null, this._cameraCanvasGl = null
        }
        pause() {
          !this.curARSession || (this._frameRequestId && this.curARSession.cancelAnimationFrame(this._frameRequestId), this.curARSession.stop(), this.yuv.clearGL(), this.app.xr = null, this.app.tick())
        }
        resume() {
          !this.curARSession || this.curARSession.start(t => {
            t && g.error("vksession start error:", t), this.app.xr.session || (g.info("\u5173\u95ED App3d \u81EA\u52A8\u5237\u65B0"), this.app.xr = {
              session: {
                requestAnimationFrame: () => {}
              },
              end: () => {},
              destroy: () => {}
            });
            const i = () => {
              this._frameRequestId = this.curARSession.requestAnimationFrame(i), this.app.tick()
            };
            i()
          })
        }
        onShow() {
          this.resume()
        }
        onHide() {
          this.pause()
        }
        getBackgroundMaterial() {
          if (this._bgMaterial) return this._bgMaterial; {
            const t = this.app.graphicsDevice,
              i = ["attribute vec3 a_position;", "varying vec2 v_texCoord;", "void main() {", "    gl_Position = vec4(a_position.xy,1.0, 1.0);", "    v_texCoord = a_position.xy * 0.5 + 0.5;", "}"].join(`
`),
              r = [`precision ${t.precision} float;`, "uniform sampler2D rgba_texture;", "varying vec2 v_texCoord;", "void main() {", "gl_FragColor = texture2D(rgba_texture, v_texCoord);", "}"].join(`
`);
            return this._bgShader = new this.pc.Shader(t, {
              attributes: {
                a_position: this.pc.SEMANTIC_POSITION
              },
              vshader: i,
              fshader: r
            }), this._bgMaterial = new this.pc.Material, this._bgMaterial.shader = this._bgShader, this._bgMaterial.depthTest = !1, this._bgMaterial.depthWrite = !1, this._bgMaterial.update(), this._bgMaterial
          }
        }
        rotationFromMotion(t, i, r) {
          [t, i, r] = [t, i, -r];
          let [n, c, d] = [i, t, r].map(P => Math.PI / 180 * P), [m, f, w] = [n, c, d].map(P => Math.cos(P / 2)), [y, x, S] = [n, c, d].map(P => Math.sin(P / 2)), R = new this.pc.Quat(y * f * w + m * x * S, m * x * w - y * f * S, m * f * S - y * x * w, m * f * w + y * x * S), A = new this.pc.Quat(-Math.sqrt(.5), 0, 0, Math.sqrt(.5));
          return R.mul(A)
        }
      }
      je.supportTrackMode = null, je.arBaseMode = h.VKSession;
      class pn {
        constructor(t, i) {
          this.camera = {
            intrinsics: null,
            viewMatrix: null,
            transfrom: null
          }, this.timestamp = t.timestamp, this.width = t.width, this.height = t.height, this.rgbaBuffer = t.data, this.camera.transfrom = i
        }
      }
      class Ii {
        constructor(t, i, r) {
          this._cameraCtxIntervalId = null, this.pc = t, this.app = i, this.curARSession = r, this._worldMatrix = new t.Mat4, this._projectMatrix = new t.Mat4, this._textureProject = new t.Mat4, this._near = .1, this._far = 1e3, this._viewWidth = this.app.graphicsDevice.canvas.width, this._viewHeight = this.app.graphicsDevice.canvas.height;
          let n = this._viewWidth / this._viewHeight,
            c = 70;
          this._projectMatrix = this.perspectiveMatrix(c, n, this._near, this._far), Ft.instance.getCalibData().then(d => {
            this._calibData = d
          }), this._curPosition = new this.pc.Vec3, this._targetPosition = new this.pc.Vec3
        }
        create(t, i, r) {
          if (this.trackMode = t.trackMode, this.trackMode == o.Dof3) {
            this.sensors = new ks, this.sensors.start(), this.sensors.on("orientationUpdate", n => {
              this._deviceMotion = n
            }, this), this.inferenceSessionManager = ci.instance, this.inferenceSessionManager.init(this.pc, this.sensors);
            try {
              this.inferenceSessionManager.loadModel("https://sightp-tour-tiny-app.sightp.com/onnxModel/ronin_resnet.onnx").then(() => {
                this.inferenceSessionManager.startInference()
              }), this.inferenceSessionManager.on("positionUpdate", n => {
                this._targetPosition || (this._targetPosition = new this.pc.Vec3), this._targetPosition.set(n[0], 0, -n[1])
              }, this)
            } catch (n) {
              console.error("\u52A0\u8F7DNN\u6A21\u578B\u5931\u8D25", n), this.inferenceSessionManager.destroy(), this.inferenceSessionManager = null, this.pdrSystem = new va(this.pc)
            }
          }
          i()
        }
        start(t) {
          if (!this.curARSession) {
            g.error("\u76F8\u673A\u4F1A\u8BDD\u5BF9\u8C61\u4E0D\u5B58\u5728");
            return
          }
          if (this._running) {
            t && t();
            return
          }
          this.app.xr.session || (g.info("\u5173\u95ED App3d \u81EA\u52A8\u5237\u65B0"), this.app.xr = {
            session: {
              requestAnimationFrame: () => {}
            },
            end: () => {},
            destroy: () => {}
          }), this._cameraFrameLitener = this.curARSession.onCameraFrame(i => {
            this._cameraFrame = {
              timestamp: Date.now() / 1e3,
              deviceMotion: {
                ...this._deviceMotion
              },
              ...i
            }, this.app.tick()
          }), this._cameraFrameLitener.start(), this._running = !0, t && t()
        }
        update() {
          if (this._cameraParams || (this._calibData ? this._cameraParams = Xt.createFromCalibData(this._calibData, 0, this._cameraFrame.width, this._cameraFrame.height) : this._cameraParams = Xt.createDefault(this._cameraFrame.width, this._cameraFrame.height, this._cameraFrame.height, 0)), this._cameraFrame) {
            let t = new this.pc.Quat;
            this._cameraFrame.deviceMotion && this.trackMode == o.Dof3 && (t = this.rotationFromMotion(this._cameraFrame.deviceMotion.alpha, this._cameraFrame.deviceMotion.beta, this._cameraFrame.deviceMotion.gamma)), this.inferenceSessionManager && this._targetPosition ? (this._curPosition.lerp(this._curPosition, this._targetPosition, .1), this._worldMatrix = new this.pc.Mat4().setTRS(this._curPosition, t, new this.pc.Vec3(1, 1, 1))) : this.pdrSystem ? (this.pdrSystem.updateWithExternalRotation(t), this._worldMatrix = this.pdrSystem.getLocalPose()) : this._worldMatrix = new this.pc.Mat4().setTRS(new this.pc.Vec3(0, 0, 0), t, new this.pc.Vec3(1, 1, 1)), this._curARFrame = new pn(this._cameraFrame, this._worldMatrix.data), Jt.instance.clsClient && Jt.instance.clsClient.updateFrame(this._curARFrame)
          }
        }
        destroy() {
          this._cameraFrame = null, this._cameraFrameLitener.stop(), this.curARSession = null, this.pdrSystem && (this.pdrSystem.destroy(), this.pdrSystem = null), this.inferenceSessionManager && (this.inferenceSessionManager.destroy(), this.inferenceSessionManager = null), this.sensors && (this.sensors.stop(), this.sensors = null), this._cameraCtxIntervalId != null && clearInterval(this._cameraCtxIntervalId)
        }
        pause() {
          !this._running || (this._cameraFrameLitener.stop(), this._cameraFrameLitener = null, this.curARSession = null, this.app.xr = null, this.app.tick(), this._running = !1, this._cameraCtxIntervalId != null && clearInterval(this._cameraCtxIntervalId))
        }
        resume() {
          if (!this._running) {
            if (!this.curARSession) {
              this._cameraCtxIntervalId = setInterval(() => {
                console.log("\u7B49\u5F85\u76F8\u673A\u4F1A\u8BDD\u5BF9\u8C61", this.curARSession), this.curARSession && (clearInterval(this._cameraCtxIntervalId), this._cameraCtxIntervalId = null, this.resume())
              }, 66);
              return
            }
            this._cameraFrameLitener = this.curARSession.onCameraFrame(t => {
              this._cameraFrame = {
                timestamp: Date.now() / 1e3,
                deviceMotion: {
                  ...this._deviceMotion
                },
                ...t
              }, this.app.tick()
            }), this._cameraFrameLitener.start(), wx.startDeviceMotionListening({
              interval: "game"
            }), this._running = !0
          }
        }
        onShow() {
          this.resume()
        }
        onHide() {
          this.pause()
        }
        getBackgroundMaterial() {
          throw new Error("Method not implemented.")
        }
        rotationFromMotion(t, i, r) {
          [t, i, r] = [t, i, -r];
          let [n, c, d] = [i, t, r].map(P => Math.PI / 180 * P), [m, f, w] = [n, c, d].map(P => Math.cos(P / 2)), [y, x, S] = [n, c, d].map(P => Math.sin(P / 2)), R = new this.pc.Quat(y * f * w + m * x * S, m * x * w - y * f * S, m * f * S - y * x * w, m * f * w + y * x * S), A = new this.pc.Quat(-Math.sqrt(.5), 0, 0, Math.sqrt(.5));
          return R.mul(A)
        }
        perspectiveMatrix(t, i, r, n) {
          let c = 1 / Math.tan(t * Math.PI / 360),
            d = 1 / (r - n),
            m = new this.pc.Mat4;
          return m.data.set([c / i, 0, 0, 0, 0, c, 0, 0, 0, 0, (n + r) * d, -1, 0, 0, 2 * n * r * d, 0]), m
        }
      }
      class mn extends hs {
        constructor(t, i, r) {
          super(), this._imageLongsideLength = ve.Normal, this._deviceOrientation = ce.Portrait, this._legacyBlockServiceFlag = !1, this._vkframe = null, this.captureCanvas = null, this.captureCTX = null, this._calibData = null, this._imageLongsideLength = i, this._deviceOrientation = r, this._arSessionCtrl = t, new Promise((n, c) => {
            this.captureCanvas = wx.createOffscreenCanvas({
              type: "2d",
              width: 480,
              height: 640
            });
            const d = setInterval(() => {
              if (this.captureCanvas) {
                this.captureCTX = this.captureCanvas.getContext("2d"), clearInterval(d), n(null);
                return
              }
              console.warn("try create capture canvas"), this.captureCanvas = wx.createOffscreenCanvas({
                type: "2d",
                width: 480,
                height: 640
              })
            }, 60)
          }), Ft.instance.getCalibData().then(n => {
            this._calibData = n
          })
        }
        set imageLongsideLength(t) {
          if (t != ve.Small && t != ve.Normal && t != ve.Big) {
            console.error(`Invalid imageLongsideLength : ${t}; It must be 640 or 960 or 1280`);
            return
          }
          this._imageLongsideLength = t
        }
        initialize() {
          this._initFlag = !0
        }
        dispose() {
          this._onFrameInput.dispose(), this.captureCanvas = null, this.captureCTX = null, this._initFlag = !1
        }
        onLegacyBlockService() {
          this._legacyBlockServiceFlag = !0
        }
        onFrameUpdate(...t) {
          if (this._vkframe == null) return;
          let i = null;
          this._arSessionCtrl.trackMode == o.Dof6 ? i = _t.SixDof : this._arSessionCtrl.trackMode == o.Dof3 ? i = _t.ThreeDofRotOnly : this._arSessionCtrl.trackMode == o.Camera && (i = _t.ZeroDof);
          const r = ye.NotTracking,
            n = this._vkframe.width,
            c = this._vkframe.height,
            d = 1;
          this._imageLongsideLength = Math.max(n, c), (this.captureCanvas.width != n * d || this.captureCanvas.height != c * d) && (this.captureCanvas.width = n * d, this.captureCanvas.height = c * d);
          const m = this._vkframe.camera.intrinsics;
          let f, w = "";
          if (m) {
            w = "\u5FAE\u4FE1\u7CFB\u7EDF\u76F8\u673A\u5185\u53C2";
            const R = {
              width: n,
              height: c,
              fx: m[4],
              fy: m[0],
              cx: m[7],
              cy: m[6]
            };
            f = Xt.createFromCalibData(R, this._deviceOrientation, n * d, c * d), f.cameraOrientation = 0
          } else this._calibData ? (w = "easyar \u6807\u6CE8\u76F8\u673A\u5185\u53C2", f = Xt.createFromCalibData(this._calibData, this._deviceOrientation, n * d, c * d)) : (w = "\u9ED8\u8BA4\u76F8\u673A\u5185\u53C2", f = Xt.createDefault(n * d, c * d, this._imageLongsideLength, this._deviceOrientation)), f.cameraOrientation = 0;
          const y = this._vkframe.timestamp;
          let x = new kt().setFromEulerAngles(0, 0, -f.getImageOrientation()),
            S = null;
          if (i == _t.SixDof || i == _t.ThreeDofRotOnly) {
            let R = new kt().set(this._vkframe.camera.transfrom);
            S = new kt().mul2(R, x)
          } else i == _t.ZeroDof && (S = null);
          if (this._imageFlag) {
            g.log(w), g.log("\u5F53\u524D\u6A21\u5F0F\uFF1A", _t[i]), this._imageFlag = !1;
            const R = this._onFrameInput,
              A = this.captureCanvas,
              P = this._vkframe.rgbaBuffer;
            let z = this.captureCTX,
              U = A.createImageData(new Uint8ClampedArray(P), this.captureCanvas.width, this.captureCanvas.height);
            z.putImageData(U, 0, 0), new Promise(Y => {
              setTimeout(() => {
                Y(A.toDataURL("image/jpeg", .7))
              })
            }).then(Y => {
              const mt = new Xe(r, i, f, y, S, Y);
              R.fire(mt)
            })
          } else {
            const R = new Xe(r, i, f, y, S);
            this._onFrameInput.fire(R)
          }
        }
        onDeviceOrientationChange(t) {
          if (t != ce.Portrait && t != ce.PortraitUpsideDown && t != ce.LandscapeLeft && t != ce.LandscapeRight) throw new Error(`Invalid deviceOrientation : ${t}; It must be 0, 90, 180 or 270`);
          this._deviceOrientation = t
        }
        setVKFrame(t) {
          this._vkframe = t
        }
      }
      class gn extends li {
        constructor(t, i, r, n) {
          super(), this._arAssembly = null, this._serviceHandler = null, this._isReady = !1, this._changeDeviceOrientation = new ct.Emitter, this._frameSource = null, this._worldMatrix = null, this._currentBlockId = null, this._currentBlockName = null, this._stoped = !0, this._paused = !0, this._arSessionCtrl = null, g.info("\u521B\u5EFA EasyARSession"), this._arSessionCtrl = t;
          let c = null;
          t instanceof je ? (g.info("\u521B\u5EFA VKFrameSource"), c = new on(t, r.imageLongsideLength, r.deviceOrientation)) : t instanceof Ii && (g.info("\u521B\u5EFA CameraFrameSource"), c = new mn(t, r.imageLongsideLength, r.deviceOrientation)), this._frameSource = c;
          let d = null;
          if (n == "block") this._serviceHandler = new Ws(i, k.Wechat), d = new ds.WxBlockTracker(this._serviceHandler, ze.Accelerometer), g.info("\u521B\u5EFA WxBlockTracker");
          else if (n == "landmark") this._serviceHandler = new Xs(i, k.Wechat), d = new ds.WxLandmarkTracker(this._serviceHandler, ze.Accelerometer), g.info("\u521B\u5EFA WxLandmarkTracker");
          else {
            g.error(`Invalid service type: ${n}`);
            return
          }
          this._arAssembly = new oa, this._arAssembly.assemble(c, d), this._intergrate(c, d, n)
        }
        initialize() {
          return new Promise(async (t, i) => {
            this._isReady || (this._serviceHandler.initFlag || (g.info("\u521D\u59CB\u5316 serviceHandler"), await this._serviceHandler.initialize()), this._arAssembly.isReady || (g.info("\u521D\u59CB\u5316 arAssembly"), this._arAssembly.initialize()), this._isReady = !0, this.fire("clsLoaded", this)), t()
          })
        }
        dispose() {
          var t, i;
          this._changeDeviceOrientation.dispose(), (t = this._serviceHandler) == null || t.reset(), (i = this._arAssembly) == null || i.dispose(), this._isReady = !1
        }
        pause() {
          !this._checkArComponents() || (this._paused = !0, this._arAssembly.tracker.toggleContinuousLocalization(!1))
        }
        start() {
          !this._checkArComponents() || (this._stoped = !1, this._paused = !1, this._arAssembly.tracker.start(), this._arAssembly.tracker.toggleContinuousLocalization(!0))
        }
        resume() {
          !this._checkArComponents() || (this._paused = !1, this._arAssembly.tracker.toggleContinuousLocalization(!0))
        }
        _stop() {
          !this._checkArComponents() || (this._stoped = !0, this._currentBlockId = null, this._worldMatrix = null, this._arAssembly.tracker.stop())
        }
        setDeviceOrientation(t) {
          this._changeDeviceOrientation.fire(t)
        }
        setRequestConfig(t) {
          if (this._checkArComponents()) try {
            this._arAssembly.tracker.serviceType == "block" ? this._serviceHandler.setRequestConfig(t) : this._arAssembly.tracker.serviceType == "landmark" && this._serviceHandler.setRequestConfig(t)
          } catch (i) {
            this.fire("localize_error", i)
          }
        }
        setContinuousLocalization(t) {
          !this._checkArComponents() || this._arAssembly.tracker.toggleContinuousLocalization(t)
        }
        setLocalizationOnly(t) {
          !this._checkArComponents() || this._arAssembly.tracker.toggleLocalizationOnly(t)
        }
        setStablize(t) {
          !this._checkArComponents() || this._arAssembly.tracker.toggleStablize(t)
        }
        setGeoLocationInput(t, i) {
          if (this._checkArComponents()) {
            if (this._arAssembly.tracker.serviceType == "block") {
              const r = this._arAssembly.tracker;
              try {
                r.setGeoLocationInput(t, i), t == "Simulator" && i && (!i.longitude || !i.latitude) && this.fire("localize_error", "Invalid Simulator GPS: " + JSON.stringify(i))
              } catch (n) {
                this.fire("localize_error", "Fail to set geo location input mode to " + t + " because of " + n.message)
              }
              return
            } else if (this._arAssembly.tracker.serviceType == "landmark") {
              const r = this._arAssembly.tracker;
              try {
                t == "Simulator" && (!i || !i.longitude || !i.latitude) && this.fire("localize_error", "Invalid Simulator GPS: " + JSON.stringify(i)), r.setGeoLocationInput(t, i)
              } catch (n) {
                this.fire("localize_error", "Fail to set geo location input mode to " + t + " because of " + n.message)
              }
              return
            }
          }
        }
        switchBlockService(t) {
          var i;
          const r = this._serviceHandler;
          try {
            this._stop(), this.fire("switchBlockService", t.blockClsConfig), r.switchBlockService(t.blockClsConfig).then(() => {
              var n;
              (n = t.success) == null || n.call(t)
            }).catch(n => {
              throw n
            })
          } catch (n) {
            this.fire("localize_error", n), (i = t.fail) == null || i.call(t, n.message)
          }
        }
        localizeOnce() {
          if (this._checkArComponents()) return this._arAssembly.tracker.localizeOnce()
        }
        async loadAnnotation(t) {
          try {
            return await this._serviceHandler.getEmaRawData(t)
          } catch (i) {
            g.error(i)
          }
        }
        recordData(t) {
          return bt.getInstance().platform || (bt.getInstance().platform = k.Wechat), bt.getInstance().isRecordingData && !t ? (bt.getInstance().isRecordingData = !1, bt.getInstance().preserveRequest()) : (!bt.getInstance().isRecordingData && t && (bt.getInstance().isRecordingData = !0), "")
        }
        async onFrameUpdate(t) {
          this._isReady && this._arAssembly.onFrameUpdate()
        }
        setPriorBlockId(t) {
          !this._arAssembly.tracker || this._arAssembly.tracker.setPriorBlockId(t)
        }
        _intergrate(t, i, r) {
          if (ct.makeSubscription(this._changeDeviceOrientation.event, n => {
              t.onDeviceOrientationChange(n)
            }), ct.makeSubscription(i.errorEvent, n => {
              g.error("localize_error", n), this.fire("localize_error", n)
            }), ct.makeSubscription(i.blockLocalizedEvent, n => {
              this._currentBlockId = n.blockId, this._currentBlockName = n.name
            }), ct.makeSubscription(i.updateCameraTransformEvent, n => {
              this._stoped || (this._worldMatrix = new Float32Array(n))
            }), r == "block") {
            const n = i;
            ct.makeSubscription(n.legacyBlockServiceEvent, () => {
              t.onLegacyBlockService()
            }), ct.makeSubscription(n.geoLocationStatus, c => {}), this._makeBlockSubscriptions(n)
          } else if (r == "landmark") {
            const n = i;
            this._makeLandmarkSubscriptions(n)
          } else g.error(`Invalid service type: ${r}`)
        }
        _makeBlockSubscriptions(t) {
          ct.makeSubscription(t.localizationResponseEvent, r => {
            this._stoped || (g.info("clsresult", {
              ...r,
              localizationStatus: Bt[r.localizationStatus]
            }), r.localizationStatus == Bt.Found ? this.fire("localize_sucess", {
              statusCode: 0,
              result: r.blockInstances,
              clsresult: r
            }) : this.fire("localize_fail", {
              statusCode: -1,
              result: r.blockInstances,
              clsresult: r
            }))
          });
          const i = this._serviceHandler;
          ct.makeSubscription(i.switchBlockServiceEvent, () => {
            t.stop(), this._paused || this.start()
          })
        }
        _makeLandmarkSubscriptions(t) {
          ct.makeSubscription(t.localizationResponseEvent, i => {
            g.log("clsresult", i), this._arSessionCtrl instanceof Ii || this._arSessionCtrl.curARSession.state == 1 ? i.localizationStatus == Bt.Found ? this.fire("localize_sucess", {
              statusCode: 0,
              result: i.blockInstances,
              clsresult: i
            }) : this.fire("localize_fail", {
              statusCode: -1,
              result: i.blockInstances,
              clsresult: i
            }) : this.fire("localize_error", {
              msg: "arSession not ready",
              state: this._arSessionCtrl.curARSession.state
            })
          })
        }
        _checkArComponents() {
          return !(!this._arAssembly || !this._arAssembly.tracker)
        }
      }
      class Ci extends gn {
        constructor(t, i) {
          const r = t.serviceType === "landmark" ? "https://landmark-api.easyar.com" : "https://clsv3-api.easyar.com";
          super(i, {
            apiKey: t.apiKey,
            apiSecret: t.apiSecret,
            appId: t.clsAppId,
            serverAddress: t.serverAddress || r
          }, new ws(ve.Normal, 0, !1), t.serviceType || "block"), this.clsdata = {}, this._offsetMatrix = null, super.initialize().then(() => {
            t.arannotationId ? super.loadAnnotation(t.arannotationId).then(n => {
              this.clsdata.ema = n, this.fire("emaLoaded", n)
            }) : this.fire("emaLoaded", null), t.autoStart ? super.start() : super._stop()
          })
        }
        get currentBlockId() {
          return this._currentBlockId
        }
        get currentBlockName() {
          return this._currentBlockName
        }
        get offsetMatrix() {
          return this._offsetMatrix
        }
        get worldMatrix() {
          return !this._currentBlockId || this._stoped ? null : this._worldMatrix
        }
        updateFrame(t) {
          this._frameSource && (this._frameSource.setVKFrame(t), super.onFrameUpdate(.3))
        }
        setGPS(t) {}
        clearFusion() {
          g.log("clearFusion \u88AB\u8C03\u7528\uFF0C\u4E0D\u505A\u4EFB\u4F55\u5904\u7406")
        }
        start(t) {
          this._stoped ? super.start() : super.resume()
        }
        stop() {
          super.pause()
        }
        getPoseInBlock(t) {
          return g.log("getPoseInBlock \u88AB\u8C03\u7528\uFF0C\u8FD4\u56DE\u7A7A\u6570\u7EC4"), new Float32Array
        }
        setConfig(t, i) {
          super.switchBlockService({
            blockClsConfig: {
              apiKey: t.apiKey,
              apiSecret: t.apiSecret,
              appId: t.clsAppId,
              serverAddress: t.serverAddress || "https://clsv3-api.easyar.com"
            },
            success: () => {
              t.arannotationId ? super.loadAnnotation(t.arannotationId).then(r => {
                this.clsdata.ema = r, this.fire("emaLoaded", r)
              }) : (this.clsdata.ema = null, this.fire("emaLoaded", null))
            }
          })
        }
        destroy() {
          super.dispose()
        }
      }
      typeof wx < "u" && !wx.isMy ? fa(sn) : typeof my < "u" && fa(en);
      class Ze {
        constructor(t, i) {
          this.pc = null, this.app = null, this._currentActiveBlockId = null, this._update = null, this.pc = t, this.app = i, this.blockTransformMap = new Map, this.blockEntityMap = new Map, this.app.on("rejesterBlock", (n, c) => {
            this.rigesterBlock(n, c)
          });
          let r = 0;
          this.app.on("update", this._update = n => {
            this._updateVIOBlocks(), r += n, r > 5 && (r = 0, this._checkUnsedBlock())
          })
        }
        set currentAcriveBlockId(t) {
          this._currentActiveBlockId != t && (this._currentActiveBlockId != null && this._setBlockActive(this._currentActiveBlockId, !1), this._currentActiveBlockId = t, this._currentActiveBlockId != null && this._setBlockActive(this._currentActiveBlockId, !0), this.app.fire("activeBlockChange", this._currentActiveBlockId))
        }
        get currentAcriveBlockId() {
          return this._currentActiveBlockId
        }
        setBlockInfo(t) {
          g.log("[BlockController]:setBlockInfo:", t);
          for (let i = 0; i < t.length; i++) {
            let r = t[i];
            if (r.keepTransform) {
              let n = r.id,
                c = this._mackTransformMat(r.transform);
              if (this.blockTransformMap.set(n, c), this.blockEntityMap.has(n)) {
                let d = this.blockEntityMap.get(n);
                for (let m = 0; m < d.length; m++) this._applyTransform(c, d[m]), g.log("[BlockController]:---------------------------"), g.log(`apply block Transform,entity:${d[m].name}`), g.log(`position:${d[m].getPosition().toString()}`), g.log(`rotation:${d[m].getRotation().toString()}`), g.log(`scale:${d[m].getLocalScale().toString()}`), g.log("[BlockController]:---------------------------")
              }
            }
          }
        }
        getBlockTransform(t) {
          return this.blockTransformMap.has(t) || this.blockTransformMap.set(t, new this.pc.Mat4), this.blockTransformMap.get(t)
        }
        rigesterBlock(t, i) {
          g.log(`[BlockController]:regesterBlock,id:${t},entity:${i.name}`), this.blockEntityMap.has(t) || this.blockEntityMap.set(t, []), this.blockEntityMap.get(t).push(i), this._applyTransform(this.getBlockTransform(t), i), g.log("[BlockController]:---------------------------"), g.log(`apply block Transform,entity:${i.name}`), g.log(`position:${i.getPosition().toString()}`), g.log(`rotation:${i.getRotation().toString()}`), g.log(`scale:${i.getLocalScale().toString()}`), g.log("[BlockController]:---------------------------"), this.currentAcriveBlockId == t || t == "VIO" ? i.enabled = !0 : i.enabled = !1
        }
        _updateVIOBlocks() {
          if (this.blockEntityMap.has("VIO")) {
            let t = this.blockEntityMap.get("VIO");
            for (let i = 0; i < t.length; i++) {
              let r = t[i],
                n = Jt.instance.vioToClsMatrix;
              this._applyTransform(n, r)
            }
          }
        }
        _applyTransform(t, i) {
          i.setPosition(t.getTranslation()), i.setRotation(new this.pc.Quat().setFromMat4(t)), i.setLocalScale(t.getScale())
        }
        destroy() {
          this.blockTransformMap.clear(), this.blockEntityMap.clear(), this.app.off("rejesterBlock"), this.app.off("update", this._update)
        }
        _checkUnsedBlock() {
          let t = this.blockEntityMap.keys();
          for (let i in t) {
            let r = i,
              n = this.blockEntityMap.get(r);
            n = n.filter(c => c.parent != null), this.blockEntityMap.set(r, n)
          }
        }
        local2worldByBlockId(t, i) {
          if (this.blockTransformMap.has(t)) {
            let r = this.blockTransformMap.get(t);
            return new this.pc.Mat4().mul2(r, i)
          } else return i
        }
        world2localByBlockId(t, i) {
          if (this.blockTransformMap.has(t)) {
            let r = this.blockTransformMap.get(t);
            return new this.pc.Mat4().mul2(r.clone().invert(), i)
          } else return i
        }
        transforAnnotations(t) {
          !t || t.forEach(i => {
            if (i.type != "node") return;
            i.localTransform || (i.localTransform = JSON.parse(JSON.stringify(i.transform)));
            let r = i.localTransform,
              n = this._mackTransformMat(r),
              c = this.local2worldByBlockId(i.parent.id, n),
              {
                x: d,
                y: m,
                z: f
              } = c.getTranslation();
            if (i.transform.position = {
                x: d,
                y: m,
                z: f
              }, i.geometry == "cube") {
              let {
                x: w,
                y,
                z: x,
                w: S
              } = new this.pc.Quat().setFromMat4(c);
              i.transform.rotation = {
                x: w,
                y,
                z: x,
                w: S
              };
              let {
                x: R,
                y: A,
                z: P
              } = c.getScale();
              i.transform.scale = {
                x: R,
                y: A,
                z: P
              }
            }
          })
        }
        _setBlockActive(t, i) {
          if (this.blockEntityMap.has(t)) {
            let r = this.blockEntityMap.get(t);
            for (let n = 0; n < r.length; n++) r[n].enabled = i
          }
        }
        _mackTransformMat(t) {
          let i = new this.pc.Mat4,
            r = new this.pc.Vec3(t.position.x, t.position.y, t.position.z),
            n = new this.pc.Quat,
            c = new this.pc.Vec3(1, 1, 1);
          return t.rotation && (n = new this.pc.Quat(t.rotation.x, t.rotation.y, t.rotation.z, t.rotation.w)), t.scale && (c = new this.pc.Vec3(t.scale.x, t.scale.y, t.scale.z)), i.setTRS(r, n, c), i
        }
      }
      const _n = {
        vk6Dof: ["ABR-AL60"],
        vk3Dof: [],
        camera3Dof: ["MIX", "SM-G9550", "OPPO R9m"],
        camera0Dof: []
      };

      function fn(l, t) {
        var i, r, n, c;
        return g.log("\u5F00\u59CB\u5224\u5B9A\u9ED1\u540D\u5355", t, l), ((i = l.camera0Dof) == null ? void 0 : i.length) > 0 && l.camera0Dof.includes(t) ? (g.log("\u89E6\u53D1\u9ED1\u540D\u5355 camera0Dof"), {
          arBaseMode: h.BaseCamera,
          arTrackMode: o.None
        }) : ((r = l.camera3Dof) == null ? void 0 : r.length) > 0 && l.camera3Dof.includes(t) ? (g.log("\u89E6\u53D1\u9ED1\u540D\u5355 camera3Dof,\u9700\u964D\u7EA7\u5230 camera0Dof"), {
          arBaseMode: h.BaseCamera,
          arTrackMode: o.Camera
        }) : ((n = l.vk3Dof) == null ? void 0 : n.length) > 0 && l.vk3Dof.includes(t) ? (g.log("\u89E6\u53D1\u9ED1\u540D\u5355 vk3Dof,\u9700\u964D\u7EA7\u5230 camera3Dof"), {
          arBaseMode: h.BaseCamera,
          arTrackMode: o.Dof3
        }) : ((c = l.vk6Dof) == null ? void 0 : c.length) > 0 && l.vk6Dof.includes(t) ? (g.log("\u89E6\u53D1\u9ED1\u540D\u5355 vk6Dof,\u9700\u964D\u7EA7\u5230 vk3Dof"), {
          arBaseMode: h.VKSession,
          arTrackMode: o.Dof3
        }) : null
      }
      const ui = class {
        constructor() {
          this.logger = g, this.pc = null, this.app = null, this.clsClient = null, this._initialized = !1, this._arCtrl = null, this._arSdk = null, this.blockController = null, this._blockInfo = null
        }
        static get instance() {
          return this._instance == null && (this._instance = new ui, this._instance.logger = g), this._instance
        }
        get sdk() {
          return this._arSdk
        }
        get arCtrl() {
          return this._arCtrl
        }
        get arSession() {
          return this._arCtrl.curARSession
        }
        get arFrame() {
          return this._arCtrl._curARFrame
        }
        get worldMatrix() {
          return this.clsClient ? this.clsClient.worldMatrix ? this.blockController ? this.blockController.local2worldByBlockId(this.clsClient.currentBlockId, new this.pc.Mat4().set(Array.from(this.clsClient.worldMatrix))) : new this.pc.Mat4().set(Array.from(this.clsClient.worldMatrix)) : null : this._arCtrl._worldMatrix
        }
        get blockMatrix() {
          return this.clsClient ? new this.pc.Mat4().set(Array.from(this.clsClient.worldMatrix)) : this._arCtrl._worldMatrix
        }
        get vioMatrix() {
          return this._arCtrl._worldMatrix
        }
        get vioToClsMatrix() {
          return this.clsClient ? this.worldMatrix ? new this.pc.Mat4().mul2(this.worldMatrix.clone(), this.vioMatrix.clone().invert()) : new this.pc.Mat4 : new this.pc.Mat4
        }
        get projectMatrix() {
          return this._arCtrl._projectMatrix
        }
        get bgMaterial() {
          return this._arCtrl && this._arCtrl.getBackgroundMaterial()
        }
        async create(l, t, i, r, n) {
          if (this._initialized) return;
          this.pc = l, this.app = t, this._initialized = !0;
          let c = await this.queryARSupport(!1);
          if (i.sdk ? i.sdk < c.arBaseMode && g.warn(`\u5224\u5B9A\u7CFB\u7EDF\u652F\u6301 ARBaseMode \u4E3A${h[c.arBaseMode]}\uFF0C\u5F53\u524D\u4F20\u5165\u6A21\u5F0F\u4E3A${h[i.sdk]}\uFF0C\u8BF7\u68C0\u67E5\u4F20\u5165\u7684 sdk \u662F\u5426\u6B63\u786E`) : i.sdk = c.arBaseMode, i.sdk == h.BaseCamera && !i.cameraContext) {
            g.error("\u8BF7\u4F20\u5165 cameraContext");
            return
          }
          return i.trackMode ? i.trackMode > c.arTrackMode && g.warn(`\u5224\u5B9A\u7CFB\u7EDF\u652F\u6301 ARTrackMode \u4E3A${o[c.arTrackMode]}\uFF0C\u5F53\u524D\u4F20\u5165\u6A21\u5F0F\u4E3A${o[i.trackMode]}\uFF0C\u8BF7\u68C0\u67E5\u4F20\u5165\u7684 trackMode \u662F\u5426\u6B63\u786E`) : i.trackMode = c.arTrackMode, this._arSdk = i.sdk, i.sdk == h.ARSession ? (this._arCtrl = new oi(l, t), i.useCls && i.clsConfig && (this.clsClient = new fs(i.clsConfig), this.blockController = new Ze(l, t), this._blockInfo && this.blockController.setBlockInfo(this._blockInfo))) : i.sdk == h.EasyAR ? (this._arCtrl = new se(l, t), i.useCls && i.clsConfig && (this.clsClient = new ys(i.clsConfig), this.blockController = new Ze(l, t), this._blockInfo && this.blockController.setBlockInfo(this._blockInfo))) : i.sdk == h.VKSession ? (this._arCtrl = new je(l, t, i.canvas), this._arCtrl.trackMode = i.trackMode, i.useCls && i.clsConfig && (this.clsClient = new Ci(i.clsConfig, this._arCtrl), this.blockController = new Ze(l, t), this._blockInfo && this.blockController.setBlockInfo(this._blockInfo))) : i.sdk == h.BaseCamera && (this._arCtrl = new Ii(l, t, i.cameraContext), this._arCtrl.trackMode = i.trackMode, i.useCls && i.clsConfig && (g.log("base camera cls"), this.clsClient = new Ci(i.clsConfig, this._arCtrl), this.blockController = new Ze(l, t), this._blockInfo && this.blockController.setBlockInfo(this._blockInfo))), this._arCtrl ? (this._arCtrl.create(i, r, n), this._initScripts(l, t), this.app.fire("ARSessionCreated", this._arCtrl)) : n && n(), this.clsClient && (this.clsClient.on("localize_sucess", (...d) => {
            this.blockController && (this.blockController.currentAcriveBlockId = this.clsClient.currentBlockId), this.app.once("frameend", () => {
              this.app.fire("localize_sucess", ...d)
            })
          }, this), this.clsClient.on("localize_fail", (...d) => {
            this.app.once("frameend", () => {
              this.app.fire("localize_fail", ...d)
            })
          }, this), this.clsClient.on("localize_error", (...d) => {
            this.app.once("frameend", () => {
              this.app.fire("localize_error", ...d)
            })
          }, this), this.clsClient.on("emaLoaded", (...d) => {
            this.blockController && this.clsClient && this.clsClient.clsdata && this.clsClient.clsdata.ema && this.blockController.transforAnnotations(this.clsClient.clsdata.ema.annotations), this.app.fire("emaLoaded", ...d)
          }, this), this.clsClient.on("clsLoaded", (...d) => {
            this.app.fire("clsLoaded", ...d)
          }, this), this.clsClient.on("switchBlockService", (...d) => {
            this.blockController.currentAcriveBlockId = null, this.app.fire("switchBlockService")
          }, this), this.app.fire("clsClientCreated", this.clsClient)), {
            arBaseMode: this._arSdk,
            arTrackMode: this._arCtrl.trackMode
          }
        }
        start(l) {
          if (this._arCtrl) {
            const t = () => {
              l && l(), this.app.fire("ARSessionStart", this._arCtrl)
            };
            this._arCtrl.start(t), this.app.on("frameupdate", this.update, this), wx.startAccelerometer({
              interval: "game",
              success: () => g.log("\u52A0\u901F\u5EA6\u8BA1\u542F\u52A8\u6210\u529F"),
              fail: i => g.warn("\u52A0\u901F\u5EA6\u8BA1\u542F\u52A8\u5931\u8D25", i)
            })
          }
        }
        update() {
          this._arCtrl && this._arCtrl.update()
        }
        stop() {
          this._arCtrl && (this._arCtrl.pause(), this.app.off("frameupdate", this.update, this)), this.clsClient, this.app.fire("arStop"), wx.stopAccelerometer({
            success: () => g.log("\u52A0\u901F\u5EA6\u8BA1\u505C\u6B62\u6210\u529F"),
            fail: l => g.log("\u52A0\u901F\u5EA6\u8BA1\u505C\u6B62\u5931\u8D25", l)
          })
        }
        restart() {
          this._arCtrl && (this._arCtrl.resume(), this.app.on("frameupdate", this.update, this)), this.clsClient, this.app.fire("arRestart"), wx.startAccelerometer({
            interval: "game",
            success: () => g.log("\u52A0\u901F\u5EA6\u8BA1\u542F\u52A8\u6210\u529F"),
            fail: l => g.log("\u52A0\u901F\u5EA6\u8BA1\u542F\u52A8\u5931\u8D25", l)
          })
        }
        onLocalizeSuccess(l, t) {
          if (!this._initialized) {
            g.warn("ARManager not initialized");
            return
          }
          this.app.on("localize_sucess", l, t)
        }
        onLocalizeFail(l, t) {
          if (!this._initialized) {
            g.warn("ARManager not initialized");
            return
          }
          this.app.on("localize_fail", l, t)
        }
        onLocalizeError(l, t) {
          if (!this._initialized) {
            g.warn("ARManager not initialized");
            return
          }
          this.app.on("localize_error", l, t)
        }
        onEmaLoaded(l, t) {
          if (!this._initialized) {
            g.warn("ARManager not initialized");
            return
          }
          this.app.on("emaLoaded", l, t)
        }
        destroy() {
          var l, t, i, r, n;
          wx.stopAccelerometer({
            success: () => g.log("\u52A0\u901F\u5EA6\u8BA1\u505C\u6B62\u6210\u529F"),
            fail: c => g.warn("\u52A0\u901F\u5EA6\u8BA1\u505C\u6B62\u5931\u8D25", c)
          });
          try {
            (l = this.app) == null || l.off("frameupdate", this.update, this), (t = this.app) == null || t.off("localize_sucess"), (i = this.app) == null || i.off("localize_fail"), (r = this.app) == null || r.off("localize_error"), (n = this.app) == null || n.off("emaLoaded"), this.clsClient && this.clsClient.destroy(), this._arCtrl && this._arCtrl.destroy(), this.blockController && this.blockController.destroy()
          } catch (c) {
            g.error(c)
          }
          this._arCtrl = null, this._initialized = !1, ui._instance = null
        }
        _initScripts(l, t) {
          if (!(this._arCtrl instanceof je && this._arCtrl._cameraRenderMode == "towCanvas") && !(this._arCtrl instanceof Ii)) {
            class r extends l.ScriptType {
              initialize() {
                let c = t.scene.layers.getLayerByName("arBg");
                c || (c = new l.Layer({
                  name: "arBg",
                  opaqueSortMode: l.SORTMODE_NONE,
                  enabled: !0
                }), t.scene.layers.insert(c, 0));
                let d = ui.instance.bgMaterial;
                var m = new l.VertexFormat(t.graphicsDevice, [{
                    semantic: l.SEMANTIC_POSITION,
                    components: 2,
                    type: l.ELEMENTTYPE_FLOAT32
                  }]),
                  f = new l.VertexBuffer(t.graphicsDevice, m, 4, l.BUFFER_STATIC),
                  w = f.lock(),
                  y = new Float32Array(w);
                y.set([-1, -1, 1, -1, -1, 1, 1, 1]), f.unlock();
                var x = new l.Mesh;
                x.vertexBuffer = f, x.primitive[0] = {
                  type: l.PRIMITIVE_TRISTRIP,
                  base: 0,
                  count: 4,
                  indexed: !1
                };
                var S = new l.GraphNode,
                  R = new l.MeshInstance(x, d, S),
                  A = new l.Model;
                A.graph = S, A.meshInstances = [R], this.entity.addComponent("model", {
                  type: "asset",
                  castShadows: !1
                }), this.entity.model.model = A, this.entity.model.enabled = !0, this.entity.model.layers = [c.id];
                let P = this.entity.camera.layers.slice(0);
                P.push(c.id), this.entity.camera.layers = P, this.on("destroy", () => {
                  this.entity.model && this.entity.removeComponent("model")
                })
              }
            }
            l.registerScript(r, "sdsArBg")
          }
          class i extends l.ScriptType {
            constructor() {
              super(...arguments), this.camera = null, this._triggeredLocalize = !1
            }
            initialize() {
              this.camera = this.entity.camera
            }
            update(n) {
              const {
                worldMatrix: c,
                vioMatrix: d,
                projectMatrix: m
              } = ui.instance;
              c && m ? (this.entity.setPosition(c.getTranslation()), this.entity.setRotation(new l.Quat().setFromMat4(c)), this.entity.setLocalScale(c.getScale()), this.camera.projectionMatrix.set(Array.from(m.data)), this._triggeredLocalize || (this._triggeredLocalize = !0, this.app.fire("firstLocalize"))) : d && m && (this._triggeredLocalize = !1, this.entity.setPosition(d.getTranslation()), this.entity.setRotation(new l.Quat().setFromMat4(d)), this.entity.setLocalScale(d.getScale()), this.camera.projectionMatrix.set(Array.from(m.data)))
            }
          }
          l.registerScript(i, "sdsArCamera")
        }
        setClsConfig(l, t = !0) {
          this.clsClient ? this.clsClient.setConfig(l, t) : (this._arSdk == h.ARSession ? this.clsClient = new fs(l) : this._arSdk == h.EasyAR ? this.clsClient = new ys(l) : this._arSdk == h.VKSession && (this.clsClient = new Ci(l, this._arCtrl)), this.blockController || (this.blockController = new Ze(this.pc, this.app), this._blockInfo && this.blockController.setBlockInfo(this._blockInfo)), this.clsClient.on("localize_sucess", (...i) => {
            this.blockController && (this.blockController.currentAcriveBlockId = this.clsClient.currentBlockId), this.app.fire("localize_sucess", ...i)
          }, this), this.clsClient.on("localize_fail", (...i) => {
            this.app.fire("localize_fail", ...i)
          }, this), this.clsClient.on("localize_error", (...i) => {
            this.app.fire("localize_error", ...i)
          }, this), this.clsClient.on("emaLoaded", (...i) => {
            this.blockController && this.clsClient && this.clsClient.clsdata && this.clsClient.clsdata.ema && this.blockController.transforAnnotations(this.clsClient.clsdata.ema.annotations), this.app.fire("emaLoaded", ...i)
          }, this), this.app.fire("clsClientCreated", this.clsClient)), this._arCtrl instanceof se && this._arCtrl.setClsConfig(l)
        }
        setBlockInfo(l) {
          l.forEach(t => {
            t.keepTransform || (t.keepTransform = !0, g.warn(`block ${t.id} keepTransform is false, set to true`))
          }), this.blockController ? (this.blockController.setBlockInfo(l), this.clsClient && this.clsClient.clsdata && this.clsClient.clsdata.ema && this.blockController.transforAnnotations(this.clsClient.clsdata.ema.annotations)) : this._blockInfo = l
        }
        takePhoto(l = "buffer") {
          return new Promise((t, i) => {
            Ft.instance.isAliPay ? this.app.once("frameend", () => {
              const r = this.app.graphicsDevice.canvas,
                n = this.app.graphicsDevice.gl,
                c = r.width,
                d = r.height;
              if (l == "buffer") {
                const m = new Uint8Array(c * d * 4);
                n.readPixels(0, 0, c, d, n.RGBA, n.UNSIGNED_BYTE, m), t([{
                  width: c,
                  height: d,
                  data: this._flip(m, c, d, 4)
                }])
              } else {
                const m = r.toDataURL("image/png");
                t([{
                  width: c,
                  height: d,
                  data: m
                }])
              }
            }) : Ft.instance.isWeChat && this.app.once("frameend", () => {
              const r = this.app.graphicsDevice.canvas,
                n = this.app.graphicsDevice.gl,
                c = this._arCtrl._cameraCanvasGl,
                d = r.width,
                m = r.height;
              if (l == "buffer") {
                const f = new Uint8Array(d * m * 4);
                if (n.readPixels(0, 0, d, m, n.RGBA, n.UNSIGNED_BYTE, f), this._arCtrl._cameraRenderMode == "towCanvas") {
                  const w = new Uint8Array(d * m * 4);
                  c.readPixels(0, 0, d, m, c.RGBA, c.UNSIGNED_BYTE, w), t([{
                    width: d,
                    height: m,
                    data: this._flip(w, d, m, 4)
                  }, {
                    width: d,
                    height: m,
                    data: this._flip(f, d, m, 4)
                  }])
                } else t([{
                  width: d,
                  height: m,
                  data: this._flip(f, d, m, 4)
                }])
              } else i("\u5FAE\u4FE1\u5E73\u53F0\u6682\u4E0D\u652F\u6301 base64 \u683C\u5F0F")
            })
          })
        }
        async isSupport() {
          if (console.warn("isSupport \u65B9\u6CD5\u5DF2\u5E9F\u5F03\uFF0C\u8BF7\u4F7F\u7528 queryARSupport \u65B9\u6CD5"), Ft.instance.isAliPay) {
            if (Ft.instance.isAndroid) return await se.canIUse();
            if (Ft.instance.isIos) return await oi.canIUse()
          } else if (Ft.instance.isWeChat) return await je.canIUse();
          return !1
        }
        async queryARSupport(l, t) {
          if (Ft.instance.isAliPay) {
            if (l && g.log("\u652F\u4ED8\u5B9D\u5E73\u53F0\u65E0\u6CD5\u4F7F\u7528\u9ED1\u540D\u5355\u529F\u80FD"), Ft.instance.isAndroid) return await se.queryARSupport();
            if (Ft.instance.isIos) return await oi.queryARSupport()
          } else if (Ft.instance.isWeChat) {
            let i = null;
            g.info("---deviceModel---"), g.info(Ft.instance.deviceModel), l && (i = fn(t || _n, Ft.instance.deviceModel));
            let r = await je.queryARSupport();
            return i ? {
              arBaseMode: Math.max(i.arBaseMode, r.arBaseMode),
              arTrackMode: Math.min(i.arTrackMode, r.arTrackMode)
            } : r
          }
        }
        _flip(l, t, i, r) {
          if (!t || !i) throw Error("Bad dimensions");
          r || (r = l.length / (t * i));
          for (var n = i >> 1, c = t * r, d = new Uint8Array(t * r), m = 0; m < n; ++m) {
            var f = m * c,
              w = (i - m - 1) * c;
            d.set(l.subarray(f, f + c)), l.copyWithin(f, w, w + c), l.set(d, w)
          }
          return l
        }
      };
      let Jt = ui;
      Jt._instance = null;

      function yn(l) {
        const t = l.getContext("webgl", {
          antialias: !1,
          useDevicePixelRatio: !0,
          alpha: !0,
          preserveDrawingBuffer: !1,
          preferWebGl2: !1
        });
        t && (t.clear(t.COLOR_BUFFER_BIT), t.clear(t.DEPTH_BUFFER_BIT), t.clear(t.STENCIL_BUFFER_BIT))
      }
      class wn {
        constructor(t) {
          this.name = "TinyARPlugin", this._arConfig = null, this.onSessionCreate = null, this.onSessionStart = null, this.onSessionCreateFail = null, this._arConfig = t, this._arConfig.clsConfig && (this._arConfig.trackMode = o.Dof6)
        }
        onTinyLuncherInited(t, i) {
          Jt.instance.create(t.pc, t.app, this._arConfig, () => {
            t.camera.script || t.camera.addComponent("script"), t.camera.script.has("sdsArBg") || t.camera.script.create("sdsArBg"), t.camera.script.has("sdsArCamera") || t.camera.script.create("sdsArCamera"), this.onSessionCreate && this.onSessionCreate(), Jt.instance.start(() => {
              this.onSessionStart && this.onSessionStart()
            })
          }, () => {
            console.error("ARManager create fail"), this.onSessionCreateFail && this.onSessionCreateFail()
          })
        }
        onDestroy(t, i) {
          Jt.instance.destroy()
        }
      }
      s.ARManager = Jt, s.ARSdk = h, s.ARTrackMode = o, s.BlockController = Ze, s.CLSClient = _s, s.EventHandler = li, s.PoseFusion = Yt, s.Recognizer_alipay_android = ys, s.Recognizer_alipay_ios = fs, s.Recognizer_wx_easyar = Ci, s.TinyARPlugin = wn, s.clearWebglCanvas = yn, s.easyar = Gr, s.systemInfo = Ft, Object.defineProperties(s, {
        __esModule: {
          value: !0
        },
        [Symbol.toStringTag]: {
          value: "Module"
        }
      })
    }), console.log("use tiny-ar-plugin v1.5.0-dev2")
  })(fi, fi.exports);
  class vt {
    constructor() {
      this.creatCountPerUpdate = 1
    }
    static get Instance() {
      return this._instance || (this._instance = new vt), this._instance
    }
    init(e, s) {
      this.app = s, this.entity = new e.Entity("objectPool", s), this.app.root.addChild(this.entity), this.app.on("update", this.update, this)
    }
    update(e) {
      if (this.jobqueue && this.jobqueue.length > 0)
        for (let s = 0; s < (this.creatCountPerUpdate < this.jobqueue.length ? this.creatCountPerUpdate : this.jobqueue.length); s++) {
          let o = this.jobqueue.shift(),
            h = this.templeteMap.get(o).clone();
          h.enabled = !1, h.reparent(this.entity), this.catchMap.get(o).push(h)
        }
    }
    register(e, s) {
      if (!this.app || !this.entity) {
        console.warn("\u5BF9\u8C61\u6C60\u672A\u521D\u59CB\u5316");
        return
      }
      this.templeteMap || (this.templeteMap = new Map), this.templeteMap.set(e.name, e), this.catchMap || (this.catchMap = new Map), this.catchMap.has(e.name) && this.catchMap.get(e.name).forEach(o => {
        o.destroy()
      }), this.catchMap.set(e.name, []), this.countMap || (this.countMap = new Map), this.countMap.set(e.name, s), this.activeMap || (this.activeMap = new Map), this.jobqueue || (this.jobqueue = []);
      for (let o = 0; o < s; o++) this.jobqueue.push(e.name)
    }
    create(e) {
      if (this.catchMap && this.catchMap.has(e)) {
        let s = this.catchMap.get(e);
        if (s.length > 0) {
          let o = s.shift();
          return this.activeMap.set(o, e), o.enabled = !0, o
        } else {
          let o = this.templeteMap.get(e).clone();
          return this.activeMap.set(o, e), o.enabled = !0, o
        }
      } else console.warn("\u672A\u5728\u5BF9\u8C61\u6C60\u4E2D\u6CE8\u518C")
    }
    destroy(e) {
      let s = this.activeMap.get(e);
      if (s) {
        let o = this.catchMap.get(s);
        o.length >= this.countMap.get(s) ? e.destroy() : (e.enabled = !1, e.reparent(this.entity), o.push(e)), this.activeMap.delete(e)
      } else e.destroy()
    }
    clear(e) {
      e ? (this.catchMap && this.catchMap.get(e)).forEach(s => {
        s.destroy()
      }) : (this.templeteMap && this.templeteMap.clear(), this.templeteMap = null, this.catchMap && this.catchMap.forEach(s => {
        s.forEach(o => {
          o.destroy()
        })
      }), this.catchMap && this.catchMap.clear(), this.catchMap = null, this.activeMap && this.activeMap.forEach((s, o) => {
        o.destroy()
      }), this.activeMap && this.activeMap.clear(), this.activeMap = null)
    }
    destroyPool() {
      this.clear(), this.entity.destroy(), this.app.off("update", this.update, this), vt._instance = null, console.log("\u6E05\u7406\u5BF9\u8C61\u6C60")
    }
  }
  class Is {
    constructor() {
      this._navPlans = []
    }
    get currentPlan() {
      return !this._currentPlan && this._navPlans.length > 0 && (this._currentPlan = this._navPlans[0], this._currentPlanIndex = 0), this._currentPlan
    }
    addPlan(e) {
      if (this._navPlans.length > 0) {
        let s = this._navPlans[this._navPlans.length - 1];
        s.needDraw === e.needDraw ? s.mergePlaneItem(e) : (this._navPlans.push(e), s.nextPlan = e, e.lastPlan = s)
      } else this._navPlans.push(e)
    }
    getNextViablePlan() {
      if (console.log("\u7531\u7EE7\u7EED\u5BFC\u822A\u66F4\u6539\u8BA1\u5212\uFF1A"), console.log("\u66F4\u6539\u524D\uFF1A", this._currentPlan.info), this._currentPlan)
        do this._currentPlanIndex += 1, this._currentPlan = this._navPlans[this._currentPlanIndex]; while (!this._currentPlan.needDraw);
      return console.log("\u66F4\u6539\u540E\uFF1A", this._currentPlan.info), this.currentPlan
    }
    clear() {
      this._navPlans = [], this._currentPlan = null, this._allSceneMarkers = null
    }
    get planCount() {
      return this._navPlans.length
    }
    get plans() {
      return this._navPlans
    }
    get allSceneMarker() {
      if (!this._allSceneMarkers) {
        this._allSceneMarkers = [];
        let e = this._navPlans[0].startMarker,
          s = this._navPlans[this._navPlans.length - 1].endMarker,
          o = e;
        for (; o != s;) this._allSceneMarkers.push(o), o = o.nextMark;
        this._allSceneMarkers.push(s)
      }
      return this._allSceneMarkers
    }
    getPlanOfMarkerIndex(e, s) {
      let o = this.currentPlan.getPlanOfMarkerIndex(e);
      return o ? (s && this._currentPlan != o && (console.log("\u7531\u4F4D\u7F6E\u5224\u5B9A\u66F4\u6539\u8BA1\u5212"), console.log("\u5F53\u524D marker:", e, ":", this._allSceneMarkers[e]), console.log("\u66F4\u6539\u524D\uFF1A", this._currentPlan.info), console.log("\u66F4\u6539\u540E\uFF1A", o.info), this._currentPlan = o, this._currentPlanIndex = this._navPlans.indexOf(o)), o) : null
    }
  }
  class Ui {
    constructor(e, s, o) {
      e && (this.code = e), s && (this.name = s), o && (this.mathNumber = o)
    }
  }
  const Cs = class {
    constructor() {
      this.defaultFloorInfo = [{
        name: "B3",
        mathNumber: -3
      }, {
        name: "B2",
        mathNumber: -2
      }, {
        name: "B1",
        mathNumber: -1
      }, {
        name: "F1",
        mathNumber: 1
      }, {
        name: "F2",
        mathNumber: 2
      }, {
        name: "F3",
        mathNumber: 3
      }, {
        name: "F4",
        mathNumber: 4
      }, {
        name: "F5",
        mathNumber: 5
      }], this._n2fMap = new Map
    }
    static get Instance() {
      return this._instance || (this._instance = new Cs), this._instance
    }
    getFloorFromMathNumber(a) {
      if (this._n2fMap.has(a)) return this._n2fMap.get(a); {
        let e = this.createDefaultFlor(a);
        return this._n2fMap.set(a, e), e
      }
    }
    getFloorFromPosition(a, e, s) {}
    createDefaultFlor(a) {
      let e = this.defaultFloorInfo.find(s => s.mathNumber == a);
      if (e) return new Ui(e.code ? e.code : null, e.name, e.mathNumber); {
        let s = a > 0 ? "F" + a : "B" + Math.abs(a);
        return new Ui(null, s, a)
      }
    }
  };
  let yi = Cs;
  yi._instance = null;
  var Ae = (a => (a.StaticArrow = "StaticArrow", a.MoveArrow = "MoveArrow", a.MeshPlane = "MeshPlane", a.AverageArrowPath = "AverageArrowPath", a.None = "None", a))(Ae || {}),
    xt = (a => (a.None = "None", a.Start = "Start", a.End = "End", a.TurnRight = "TurnRight", a.TurnLeft = "TurnLeft", a.GoUp = "GoUp", a.GoDown = "GoDown", a.GoBack = "GoBack", a.Elevator = "Elevator", a.Stairs = "Stairs", a.Escalator = "Escalator", a))(xt || {}),
    oe = (a => (a[a.WormholeStart = 0] = "WormholeStart", a[a.WormholeEnd = 1] = "WormholeEnd", a))(oe || {});
  class Ps {
    constructor(e, s) {
      this._pathLength = null, this._needDraw = null, this._info = null, this._startSceneMarker = e, this._endSceneMarker = s, [xt.Elevator, xt.Escalator, xt.Stairs].includes(e.action) && e.action == s.action && e.floor != s.floor && (e.addTag(oe.WormholeStart), s.addTag(oe.WormholeEnd))
    }
    get startMarker() {
      return this._startSceneMarker
    }
    get endMarker() {
      return this._endSceneMarker
    }
    get sceneMarkers() {
      return this._sceneMarkers || this._refrashPath(), this._sceneMarkers
    }
    get pathLength() {
      return this._pathLength == null && this._refrashPath(), this._pathLength
    }
    _refrashPath() {
      this._sceneMarkers = [], this._pathLength = 0;
      let e = this._startSceneMarker;
      for (; e != this._endSceneMarker;) this._sceneMarkers.push(e), this._pathLength += e.distanceToNext, e = e.nextMark;
      this._sceneMarkers.push(e)
    }
    get needDraw() {
      return this._needDraw == null && (this._startSceneMarker.hasTag(oe.WormholeStart) && this._endSceneMarker.hasTag(oe.WormholeEnd) ? this._needDraw = !1 : this._startSceneMarker.hasTag(oe.WormholeEnd) && this._endSceneMarker.hasTag(oe.WormholeStart) && this.pathLength < 5 ? this._needDraw = !1 : this._needDraw = !0), this._needDraw
    }
    get markersCount() {
      return this._sceneMarkers || this._refrashPath(), this._sceneMarkers.length
    }
    get info() {
      return this._info || (this._info = {
        startFloor: yi.Instance.getFloorFromMathNumber(this._startSceneMarker.floor),
        endFloor: yi.Instance.getFloorFromMathNumber(this._endSceneMarker.floor),
        crossFloor: this._endSceneMarker.floor - this._startSceneMarker.floor,
        startAction: this._startSceneMarker.action,
        endAction: this._endSceneMarker.action,
        pathLength: this.pathLength
      }), this._info
    }
    mergePlaneItem(e) {
      if (this._endSceneMarker == e._startSceneMarker) {
        let s = this._endSceneMarker;
        this._endSceneMarker = e._endSceneMarker;
        let o = this._needDraw;
        if (this.reset(), o === e.needDraw && (this._needDraw = o, this._needDraw && this._endSceneMarker.break))
          for (s.break = !1; s.lastMark && !s.lastMark.break;) s = s.lastMark, s.resetNextBreakMarker();
        return this
      } else return console.warn("can not merge plan"), null
    }
    reset() {
      this._sceneMarkers = null, this._needDraw = null, this._pathLength = null
    }
    get nextPlan() {
      return this._nextPlan
    }
    set nextPlan(e) {
      this._nextPlan = e
    }
    get lastPlan() {
      return this._lastPlan
    }
    set lastPlan(e) {
      this._lastPlan = e
    }
    get startIndex() {
      return this.lastPlan ? this.lastPlan.endIndex : 0
    }
    get endIndex() {
      return this.startIndex + this.markersCount - 1
    }
    getPlanOfMarkerIndex(e) {
      return e >= this.startIndex && e < this.endIndex ? this : e >= this.endIndex ? this.nextPlan ? this.nextPlan.getPlanOfMarkerIndex(e) : this : e < this.startIndex && this.lastPlan ? this.lastPlan.getPlanOfMarkerIndex(e) : null
    }
  }
  const Zt = {
      DEG_TO_RAD: Math.PI / 180,
      RAD_TO_DEG: 180 / Math.PI,
      clamp: function (a, e, s) {
        return a >= s ? s : a <= e ? e : a
      },
      intToBytes24: function (a) {
        const e = a >> 16 & 255,
          s = a >> 8 & 255,
          o = a & 255;
        return [e, s, o]
      },
      intToBytes32: function (a) {
        const e = a >> 24 & 255,
          s = a >> 16 & 255,
          o = a >> 8 & 255,
          h = a & 255;
        return [e, s, o, h]
      },
      bytesToInt24: function (a, e, s) {
        return a.length && (s = a[2], e = a[1], a = a[0]), a << 16 | e << 8 | s
      },
      bytesToInt32: function (a, e, s, o) {
        return a.length && (o = a[3], s = a[2], e = a[1], a = a[0]), (a << 24 | e << 16 | s << 8 | o) >>> 0
      },
      lerp: function (a, e, s) {
        return a + (e - a) * Zt.clamp(s, 0, 1)
      },
      lerpAngle: function (a, e, s) {
        return e - a > 180 && (e -= 360), e - a < -180 && (e += 360), Zt.lerp(a, e, Zt.clamp(s, 0, 1))
      },
      powerOfTwo: function (a) {
        return a !== 0 && !(a & a - 1)
      },
      nextPowerOfTwo: function (a) {
        return a--, a |= a >> 1, a |= a >> 2, a |= a >> 4, a |= a >> 8, a |= a >> 16, a++, a
      },
      random: function (a, e) {
        const s = e - a;
        return Math.random() * s + a
      },
      smoothstep: function (a, e, s) {
        return s <= a ? 0 : s >= e ? 1 : (s = (s - a) / (e - a), s * s * (3 - 2 * s))
      },
      smootherstep: function (a, e, s) {
        return s <= a ? 0 : s >= e ? 1 : (s = (s - a) / (e - a), s * s * s * (s * (s * 6 - 15) + 10))
      },
      roundUp: function (a, e) {
        return e === 0 ? a : Math.ceil(a / e) * e
      },
      between: function (a, e, s, o) {
        const h = Math.min(e, s),
          u = Math.max(e, s);
        return o ? a >= h && a <= u : a > h && a < u
      }
    },
    Re = class {
      constructor(a = 0, e = 0) {
        a.length === 2 ? (this.x = a[0], this.y = a[1]) : (this.x = a, this.y = e)
      }
      add(a) {
        return this.x += a.x, this.y += a.y, this
      }
      add2(a, e) {
        return this.x = a.x + e.x, this.y = a.y + e.y, this
      }
      addScalar(a) {
        return this.x += a, this.y += a, this
      }
      clone() {
        return new Re(this.x, this.y)
      }
      copy(a) {
        return this.x = a.x, this.y = a.y, this
      }
      cross(a) {
        return this.x * a.y - this.y * a.x
      }
      distance(a) {
        const e = this.x - a.x,
          s = this.y - a.y;
        return Math.sqrt(e * e + s * s)
      }
      div(a) {
        return this.x /= a.x, this.y /= a.y, this
      }
      div2(a, e) {
        return this.x = a.x / e.x, this.y = a.y / e.y, this
      }
      divScalar(a) {
        return this.x /= a, this.y /= a, this
      }
      dot(a) {
        return this.x * a.x + this.y * a.y
      }
      equals(a) {
        return this.x === a.x && this.y === a.y
      }
      length() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
      }
      lengthSq() {
        return this.x * this.x + this.y * this.y
      }
      lerp(a, e, s) {
        return this.x = a.x + s * (e.x - a.x), this.y = a.y + s * (e.y - a.y), this
      }
      mul(a) {
        return this.x *= a.x, this.y *= a.y, this
      }
      mul2(a, e) {
        return this.x = a.x * e.x, this.y = a.y * e.y, this
      }
      mulScalar(a) {
        return this.x *= a, this.y *= a, this
      }
      normalize() {
        const a = this.x * this.x + this.y * this.y;
        if (a > 0) {
          const e = 1 / Math.sqrt(a);
          this.x *= e, this.y *= e
        }
        return this
      }
      floor() {
        return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this
      }
      ceil() {
        return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this
      }
      round() {
        return this.x = Math.round(this.x), this.y = Math.round(this.y), this
      }
      min(a) {
        return a.x < this.x && (this.x = a.x), a.y < this.y && (this.y = a.y), this
      }
      max(a) {
        return a.x > this.x && (this.x = a.x), a.y > this.y && (this.y = a.y), this
      }
      set(a, e) {
        return this.x = a, this.y = e, this
      }
      sub(a) {
        return this.x -= a.x, this.y -= a.y, this
      }
      sub2(a, e) {
        return this.x = a.x - e.x, this.y = a.y - e.y, this
      }
      subScalar(a) {
        return this.x -= a, this.y -= a, this
      }
      toString() {
        return `[${this.x}, ${this.y}]`
      }
      static angleRad(a, e) {
        return Math.atan2(a.x * e.y - a.y * e.x, a.x * e.x + a.y * e.y)
      }
    };
  let he = Re;
  he.ZERO = Object.freeze(new Re(0, 0)), he.ONE = Object.freeze(new Re(1, 1)), he.UP = Object.freeze(new Re(0, 1)), he.DOWN = Object.freeze(new Re(0, -1)), he.RIGHT = Object.freeze(new Re(1, 0)), he.LEFT = Object.freeze(new Re(-1, 0));
  const fe = class {
    constructor(a = 0, e = 0, s = 0) {
      a.length === 3 ? (this.x = a[0], this.y = a[1], this.z = a[2]) : (this.x = a, this.y = e, this.z = s)
    }
    add(a) {
      return this.x += a.x, this.y += a.y, this.z += a.z, this
    }
    add2(a, e) {
      return this.x = a.x + e.x, this.y = a.y + e.y, this.z = a.z + e.z, this
    }
    addScalar(a) {
      return this.x += a, this.y += a, this.z += a, this
    }
    clone() {
      return new fe(this.x, this.y, this.z)
    }
    copy(a) {
      return this.x = a.x, this.y = a.y, this.z = a.z, this
    }
    cross(a, e) {
      const s = a.x,
        o = a.y,
        h = a.z,
        u = e.x,
        p = e.y,
        _ = e.z;
      return this.x = o * _ - p * h, this.y = h * u - _ * s, this.z = s * p - u * o, this
    }
    distance(a) {
      const e = this.x - a.x,
        s = this.y - a.y,
        o = this.z - a.z;
      return Math.sqrt(e * e + s * s + o * o)
    }
    div(a) {
      return this.x /= a.x, this.y /= a.y, this.z /= a.z, this
    }
    div2(a, e) {
      return this.x = a.x / e.x, this.y = a.y / e.y, this.z = a.z / e.z, this
    }
    divScalar(a) {
      return this.x /= a, this.y /= a, this.z /= a, this
    }
    dot(a) {
      return this.x * a.x + this.y * a.y + this.z * a.z
    }
    equals(a) {
      return this.x === a.x && this.y === a.y && this.z === a.z
    }
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    }
    lengthSq() {
      return this.x * this.x + this.y * this.y + this.z * this.z
    }
    lerp(a, e, s) {
      return this.x = a.x + s * (e.x - a.x), this.y = a.y + s * (e.y - a.y), this.z = a.z + s * (e.z - a.z), this
    }
    mul(a) {
      return this.x *= a.x, this.y *= a.y, this.z *= a.z, this
    }
    mul2(a, e) {
      return this.x = a.x * e.x, this.y = a.y * e.y, this.z = a.z * e.z, this
    }
    mulScalar(a) {
      return this.x *= a, this.y *= a, this.z *= a, this
    }
    normalize() {
      const a = this.x * this.x + this.y * this.y + this.z * this.z;
      if (a > 0) {
        const e = 1 / Math.sqrt(a);
        this.x *= e, this.y *= e, this.z *= e
      }
      return this
    }
    floor() {
      return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this
    }
    ceil() {
      return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this
    }
    round() {
      return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this
    }
    min(a) {
      return a.x < this.x && (this.x = a.x), a.y < this.y && (this.y = a.y), a.z < this.z && (this.z = a.z), this
    }
    max(a) {
      return a.x > this.x && (this.x = a.x), a.y > this.y && (this.y = a.y), a.z > this.z && (this.z = a.z), this
    }
    project(a) {
      const e = this.x * a.x + this.y * a.y + this.z * a.z,
        s = a.x * a.x + a.y * a.y + a.z * a.z,
        o = e / s;
      return this.x = a.x * o, this.y = a.y * o, this.z = a.z * o, this
    }
    set(a, e, s) {
      return this.x = a, this.y = e, this.z = s, this
    }
    sub(a) {
      return this.x -= a.x, this.y -= a.y, this.z -= a.z, this
    }
    sub2(a, e) {
      return this.x = a.x - e.x, this.y = a.y - e.y, this.z = a.z - e.z, this
    }
    subScalar(a) {
      return this.x -= a, this.y -= a, this.z -= a, this
    }
    toString() {
      return `[${this.x}, ${this.y}, ${this.z}]`
    }
  };
  let tt = fe;
  tt.ZERO = Object.freeze(new fe(0, 0, 0)), tt.ONE = Object.freeze(new fe(1, 1, 1)), tt.UP = Object.freeze(new fe(0, 1, 0)), tt.DOWN = Object.freeze(new fe(0, -1, 0)), tt.RIGHT = Object.freeze(new fe(1, 0, 0)), tt.LEFT = Object.freeze(new fe(-1, 0, 0)), tt.FORWARD = Object.freeze(new fe(0, 0, -1)), tt.BACK = Object.freeze(new fe(0, 0, 1));
  const wi = class {
    constructor(a = 0, e = 0, s = 0, o = 0) {
      a.length === 4 ? (this.x = a[0], this.y = a[1], this.z = a[2], this.w = a[3]) : (this.x = a, this.y = e, this.z = s, this.w = o)
    }
    add(a) {
      return this.x += a.x, this.y += a.y, this.z += a.z, this.w += a.w, this
    }
    add2(a, e) {
      return this.x = a.x + e.x, this.y = a.y + e.y, this.z = a.z + e.z, this.w = a.w + e.w, this
    }
    addScalar(a) {
      return this.x += a, this.y += a, this.z += a, this.w += a, this
    }
    clone() {
      return new wi(this.x, this.y, this.z, this.w)
    }
    copy(a) {
      return this.x = a.x, this.y = a.y, this.z = a.z, this.w = a.w, this
    }
    div(a) {
      return this.x /= a.x, this.y /= a.y, this.z /= a.z, this.w /= a.w, this
    }
    div2(a, e) {
      return this.x = a.x / e.x, this.y = a.y / e.y, this.z = a.z / e.z, this.w = a.w / e.w, this
    }
    divScalar(a) {
      return this.x /= a, this.y /= a, this.z /= a, this.w /= a, this
    }
    dot(a) {
      return this.x * a.x + this.y * a.y + this.z * a.z + this.w * a.w
    }
    equals(a) {
      return this.x === a.x && this.y === a.y && this.z === a.z && this.w === a.w
    }
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w)
    }
    lengthSq() {
      return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
    }
    lerp(a, e, s) {
      return this.x = a.x + s * (e.x - a.x), this.y = a.y + s * (e.y - a.y), this.z = a.z + s * (e.z - a.z), this.w = a.w + s * (e.w - a.w), this
    }
    mul(a) {
      return this.x *= a.x, this.y *= a.y, this.z *= a.z, this.w *= a.w, this
    }
    mul2(a, e) {
      return this.x = a.x * e.x, this.y = a.y * e.y, this.z = a.z * e.z, this.w = a.w * e.w, this
    }
    mulScalar(a) {
      return this.x *= a, this.y *= a, this.z *= a, this.w *= a, this
    }
    normalize() {
      const a = this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
      if (a > 0) {
        const e = 1 / Math.sqrt(a);
        this.x *= e, this.y *= e, this.z *= e, this.w *= e
      }
      return this
    }
    floor() {
      return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this.w = Math.floor(this.w), this
    }
    ceil() {
      return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this.w = Math.ceil(this.w), this
    }
    round() {
      return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this.w = Math.round(this.w), this
    }
    min(a) {
      return a.x < this.x && (this.x = a.x), a.y < this.y && (this.y = a.y), a.z < this.z && (this.z = a.z), a.w < this.w && (this.w = a.w), this
    }
    max(a) {
      return a.x > this.x && (this.x = a.x), a.y > this.y && (this.y = a.y), a.z > this.z && (this.z = a.z), a.w > this.w && (this.w = a.w), this
    }
    set(a, e, s, o) {
      return this.x = a, this.y = e, this.z = s, this.w = o, this
    }
    sub(a) {
      return this.x -= a.x, this.y -= a.y, this.z -= a.z, this.w -= a.w, this
    }
    sub2(a, e) {
      return this.x = a.x - e.x, this.y = a.y - e.y, this.z = a.z - e.z, this.w = a.w - e.w, this
    }
    subScalar(a) {
      return this.x -= a, this.y -= a, this.z -= a, this.w -= a, this
    }
    toString() {
      return `[${this.x}, ${this.y}, ${this.z}, ${this.w}]`
    }
  };
  let vi = wi;
  vi.ZERO = Object.freeze(new wi(0, 0, 0, 0)), vi.ONE = Object.freeze(new wi(1, 1, 1, 1));
  const ei = new he,
    Be = new tt,
    Ie = new tt,
    Ce = new tt,
    xi = new tt,
    ii = class {
      constructor() {
        const a = new Float32Array(16);
        a[0] = a[5] = a[10] = a[15] = 1, this.data = a
      }
      static _getPerspectiveHalfSize(a, e, s, o, h) {
        h ? (a.x = o * Math.tan(e * Math.PI / 360), a.y = a.x / s) : (a.y = o * Math.tan(e * Math.PI / 360), a.x = a.y * s)
      }
      add2(a, e) {
        const s = a.data,
          o = e.data,
          h = this.data;
        return h[0] = s[0] + o[0], h[1] = s[1] + o[1], h[2] = s[2] + o[2], h[3] = s[3] + o[3], h[4] = s[4] + o[4], h[5] = s[5] + o[5], h[6] = s[6] + o[6], h[7] = s[7] + o[7], h[8] = s[8] + o[8], h[9] = s[9] + o[9], h[10] = s[10] + o[10], h[11] = s[11] + o[11], h[12] = s[12] + o[12], h[13] = s[13] + o[13], h[14] = s[14] + o[14], h[15] = s[15] + o[15], this
      }
      add(a) {
        return this.add2(this, a)
      }
      clone() {
        return new ii().copy(this)
      }
      copy(a) {
        const e = a.data,
          s = this.data;
        return s[0] = e[0], s[1] = e[1], s[2] = e[2], s[3] = e[3], s[4] = e[4], s[5] = e[5], s[6] = e[6], s[7] = e[7], s[8] = e[8], s[9] = e[9], s[10] = e[10], s[11] = e[11], s[12] = e[12], s[13] = e[13], s[14] = e[14], s[15] = e[15], this
      }
      equals(a) {
        const e = this.data,
          s = a.data;
        return e[0] === s[0] && e[1] === s[1] && e[2] === s[2] && e[3] === s[3] && e[4] === s[4] && e[5] === s[5] && e[6] === s[6] && e[7] === s[7] && e[8] === s[8] && e[9] === s[9] && e[10] === s[10] && e[11] === s[11] && e[12] === s[12] && e[13] === s[13] && e[14] === s[14] && e[15] === s[15]
      }
      isIdentity() {
        const a = this.data;
        return a[0] === 1 && a[1] === 0 && a[2] === 0 && a[3] === 0 && a[4] === 0 && a[5] === 1 && a[6] === 0 && a[7] === 0 && a[8] === 0 && a[9] === 0 && a[10] === 1 && a[11] === 0 && a[12] === 0 && a[13] === 0 && a[14] === 0 && a[15] === 1
      }
      mul2(a, e) {
        const s = a.data,
          o = e.data,
          h = this.data,
          u = s[0],
          p = s[1],
          _ = s[2],
          g = s[3],
          k = s[4],
          E = s[5],
          D = s[6],
          B = s[7],
          O = s[8],
          H = s[9],
          Q = s[10],
          it = s[11],
          V = s[12],
          nt = s[13],
          ct = s[14],
          Ct = s[15];
        let yt, st, et, Rt;
        return yt = o[0], st = o[1], et = o[2], Rt = o[3], h[0] = u * yt + k * st + O * et + V * Rt, h[1] = p * yt + E * st + H * et + nt * Rt, h[2] = _ * yt + D * st + Q * et + ct * Rt, h[3] = g * yt + B * st + it * et + Ct * Rt, yt = o[4], st = o[5], et = o[6], Rt = o[7], h[4] = u * yt + k * st + O * et + V * Rt, h[5] = p * yt + E * st + H * et + nt * Rt, h[6] = _ * yt + D * st + Q * et + ct * Rt, h[7] = g * yt + B * st + it * et + Ct * Rt, yt = o[8], st = o[9], et = o[10], Rt = o[11], h[8] = u * yt + k * st + O * et + V * Rt, h[9] = p * yt + E * st + H * et + nt * Rt, h[10] = _ * yt + D * st + Q * et + ct * Rt, h[11] = g * yt + B * st + it * et + Ct * Rt, yt = o[12], st = o[13], et = o[14], Rt = o[15], h[12] = u * yt + k * st + O * et + V * Rt, h[13] = p * yt + E * st + H * et + nt * Rt, h[14] = _ * yt + D * st + Q * et + ct * Rt, h[15] = g * yt + B * st + it * et + Ct * Rt, this
      }
      mulAffine2(a, e) {
        const s = a.data,
          o = e.data,
          h = this.data,
          u = s[0],
          p = s[1],
          _ = s[2],
          g = s[4],
          k = s[5],
          E = s[6],
          D = s[8],
          B = s[9],
          O = s[10],
          H = s[12],
          Q = s[13],
          it = s[14];
        let V, nt, ct;
        return V = o[0], nt = o[1], ct = o[2], h[0] = u * V + g * nt + D * ct, h[1] = p * V + k * nt + B * ct, h[2] = _ * V + E * nt + O * ct, h[3] = 0, V = o[4], nt = o[5], ct = o[6], h[4] = u * V + g * nt + D * ct, h[5] = p * V + k * nt + B * ct, h[6] = _ * V + E * nt + O * ct, h[7] = 0, V = o[8], nt = o[9], ct = o[10], h[8] = u * V + g * nt + D * ct, h[9] = p * V + k * nt + B * ct, h[10] = _ * V + E * nt + O * ct, h[11] = 0, V = o[12], nt = o[13], ct = o[14], h[12] = u * V + g * nt + D * ct + H, h[13] = p * V + k * nt + B * ct + Q, h[14] = _ * V + E * nt + O * ct + it, h[15] = 1, this
      }
      mul(a) {
        return this.mul2(this, a)
      }
      transformPoint(a, e = new tt) {
        const s = this.data,
          o = a.x,
          h = a.y,
          u = a.z;
        return e.x = o * s[0] + h * s[4] + u * s[8] + s[12], e.y = o * s[1] + h * s[5] + u * s[9] + s[13], e.z = o * s[2] + h * s[6] + u * s[10] + s[14], e
      }
      transformVector(a, e = new tt) {
        const s = this.data,
          o = a.x,
          h = a.y,
          u = a.z;
        return e.x = o * s[0] + h * s[4] + u * s[8], e.y = o * s[1] + h * s[5] + u * s[9], e.z = o * s[2] + h * s[6] + u * s[10], e
      }
      transformVec4(a, e = new vi) {
        const s = this.data,
          o = a.x,
          h = a.y,
          u = a.z,
          p = a.w;
        return e.x = o * s[0] + h * s[4] + u * s[8] + p * s[12], e.y = o * s[1] + h * s[5] + u * s[9] + p * s[13], e.z = o * s[2] + h * s[6] + u * s[10] + p * s[14], e.w = o * s[3] + h * s[7] + u * s[11] + p * s[15], e
      }
      setLookAt(a, e, s) {
        Ce.sub2(a, e).normalize(), Ie.copy(s).normalize(), Be.cross(Ie, Ce).normalize(), Ie.cross(Ce, Be);
        const o = this.data;
        return o[0] = Be.x, o[1] = Be.y, o[2] = Be.z, o[3] = 0, o[4] = Ie.x, o[5] = Ie.y, o[6] = Ie.z, o[7] = 0, o[8] = Ce.x, o[9] = Ce.y, o[10] = Ce.z, o[11] = 0, o[12] = a.x, o[13] = a.y, o[14] = a.z, o[15] = 1, this
      }
      setFrustum(a, e, s, o, h, u) {
        const p = 2 * h,
          _ = e - a,
          g = o - s,
          k = u - h,
          E = this.data;
        return E[0] = p / _, E[1] = 0, E[2] = 0, E[3] = 0, E[4] = 0, E[5] = p / g, E[6] = 0, E[7] = 0, E[8] = (e + a) / _, E[9] = (o + s) / g, E[10] = (-u - h) / k, E[11] = -1, E[12] = 0, E[13] = 0, E[14] = -p * u / k, E[15] = 0, this
      }
      setPerspective(a, e, s, o, h) {
        return ii._getPerspectiveHalfSize(ei, a, e, s, h), this.setFrustum(-ei.x, ei.x, -ei.y, ei.y, s, o)
      }
      setOrtho(a, e, s, o, h, u) {
        const p = this.data;
        return p[0] = 2 / (e - a), p[1] = 0, p[2] = 0, p[3] = 0, p[4] = 0, p[5] = 2 / (o - s), p[6] = 0, p[7] = 0, p[8] = 0, p[9] = 0, p[10] = -2 / (u - h), p[11] = 0, p[12] = -(e + a) / (e - a), p[13] = -(o + s) / (o - s), p[14] = -(u + h) / (u - h), p[15] = 1, this
      }
      setFromAxisAngle(a, e) {
        e *= Zt.DEG_TO_RAD;
        const s = a.x,
          o = a.y,
          h = a.z,
          u = Math.cos(e),
          p = Math.sin(e),
          _ = 1 - u,
          g = _ * s,
          k = _ * o,
          E = this.data;
        return E[0] = g * s + u, E[1] = g * o + p * h, E[2] = g * h - p * o, E[3] = 0, E[4] = g * o - p * h, E[5] = k * o + u, E[6] = k * h + p * s, E[7] = 0, E[8] = g * h + p * o, E[9] = k * h - s * p, E[10] = _ * h * h + u, E[11] = 0, E[12] = 0, E[13] = 0, E[14] = 0, E[15] = 1, this
      }
      setTranslate(a, e, s) {
        const o = this.data;
        return o[0] = 1, o[1] = 0, o[2] = 0, o[3] = 0, o[4] = 0, o[5] = 1, o[6] = 0, o[7] = 0, o[8] = 0, o[9] = 0, o[10] = 1, o[11] = 0, o[12] = a, o[13] = e, o[14] = s, o[15] = 1, this
      }
      setScale(a, e, s) {
        const o = this.data;
        return o[0] = a, o[1] = 0, o[2] = 0, o[3] = 0, o[4] = 0, o[5] = e, o[6] = 0, o[7] = 0, o[8] = 0, o[9] = 0, o[10] = s, o[11] = 0, o[12] = 0, o[13] = 0, o[14] = 0, o[15] = 1, this
      }
      setViewport(a, e, s, o) {
        const h = this.data;
        return h[0] = s * .5, h[1] = 0, h[2] = 0, h[3] = 0, h[4] = 0, h[5] = o * .5, h[6] = 0, h[7] = 0, h[8] = 0, h[9] = 0, h[10] = .5, h[11] = 0, h[12] = a + s * .5, h[13] = e + o * .5, h[14] = .5, h[15] = 1, this
      }
      invert() {
        const a = this.data,
          e = a[0],
          s = a[1],
          o = a[2],
          h = a[3],
          u = a[4],
          p = a[5],
          _ = a[6],
          g = a[7],
          k = a[8],
          E = a[9],
          D = a[10],
          B = a[11],
          O = a[12],
          H = a[13],
          Q = a[14],
          it = a[15],
          V = e * p - s * u,
          nt = e * _ - o * u,
          ct = e * g - h * u,
          Ct = s * _ - o * p,
          yt = s * g - h * p,
          st = o * g - h * _,
          et = k * H - E * O,
          Rt = k * Q - D * O,
          Vt = k * it - B * O,
          Et = E * Q - D * H,
          qt = E * it - B * H,
          kt = D * it - B * Q,
          ye = V * kt - nt * qt + ct * Et + Ct * Vt - yt * Rt + st * et;
        if (ye === 0) this.setIdentity();
        else {
          const _t = 1 / ye;
          a[0] = (p * kt - _ * qt + g * Et) * _t, a[1] = (-s * kt + o * qt - h * Et) * _t, a[2] = (H * st - Q * yt + it * Ct) * _t, a[3] = (-E * st + D * yt - B * Ct) * _t, a[4] = (-u * kt + _ * Vt - g * Rt) * _t, a[5] = (e * kt - o * Vt + h * Rt) * _t, a[6] = (-O * st + Q * ct - it * nt) * _t, a[7] = (k * st - D * ct + B * nt) * _t, a[8] = (u * qt - p * Vt + g * et) * _t, a[9] = (-e * qt + s * Vt - h * et) * _t, a[10] = (O * yt - H * ct + it * V) * _t, a[11] = (-k * yt + E * ct - B * V) * _t, a[12] = (-u * Et + p * Rt - _ * et) * _t, a[13] = (e * Et - s * Rt + o * et) * _t, a[14] = (-O * Ct + H * nt - Q * V) * _t, a[15] = (k * Ct - E * nt + D * V) * _t
        }
        return this
      }
      set(a) {
        const e = this.data;
        return e[0] = a[0], e[1] = a[1], e[2] = a[2], e[3] = a[3], e[4] = a[4], e[5] = a[5], e[6] = a[6], e[7] = a[7], e[8] = a[8], e[9] = a[9], e[10] = a[10], e[11] = a[11], e[12] = a[12], e[13] = a[13], e[14] = a[14], e[15] = a[15], this
      }
      setIdentity() {
        const a = this.data;
        return a[0] = 1, a[1] = 0, a[2] = 0, a[3] = 0, a[4] = 0, a[5] = 1, a[6] = 0, a[7] = 0, a[8] = 0, a[9] = 0, a[10] = 1, a[11] = 0, a[12] = 0, a[13] = 0, a[14] = 0, a[15] = 1, this
      }
      setTRS(a, e, s) {
        const o = e.x,
          h = e.y,
          u = e.z,
          p = e.w,
          _ = s.x,
          g = s.y,
          k = s.z,
          E = o + o,
          D = h + h,
          B = u + u,
          O = o * E,
          H = o * D,
          Q = o * B,
          it = h * D,
          V = h * B,
          nt = u * B,
          ct = p * E,
          Ct = p * D,
          yt = p * B,
          st = this.data;
        return st[0] = (1 - (it + nt)) * _, st[1] = (H + yt) * _, st[2] = (Q - Ct) * _, st[3] = 0, st[4] = (H - yt) * g, st[5] = (1 - (O + nt)) * g, st[6] = (V + ct) * g, st[7] = 0, st[8] = (Q + Ct) * k, st[9] = (V - ct) * k, st[10] = (1 - (O + it)) * k, st[11] = 0, st[12] = a.x, st[13] = a.y, st[14] = a.z, st[15] = 1, this
      }
      transpose() {
        let a;
        const e = this.data;
        return a = e[1], e[1] = e[4], e[4] = a, a = e[2], e[2] = e[8], e[8] = a, a = e[3], e[3] = e[12], e[12] = a, a = e[6], e[6] = e[9], e[9] = a, a = e[7], e[7] = e[13], e[13] = a, a = e[11], e[11] = e[14], e[14] = a, this
      }
      invertTo3x3(a) {
        const e = this.data,
          s = a.data,
          o = e[0],
          h = e[1],
          u = e[2],
          p = e[4],
          _ = e[5],
          g = e[6],
          k = e[8],
          E = e[9],
          D = e[10],
          B = D * _ - g * E,
          O = -D * h + u * E,
          H = g * h - u * _,
          Q = -D * p + g * k,
          it = D * o - u * k,
          V = -g * o + u * p,
          nt = E * p - _ * k,
          ct = -E * o + h * k,
          Ct = _ * o - h * p,
          yt = o * B + h * Q + u * nt;
        if (yt === 0) return this;
        const st = 1 / yt;
        return s[0] = st * B, s[1] = st * O, s[2] = st * H, s[3] = st * Q, s[4] = st * it, s[5] = st * V, s[6] = st * nt, s[7] = st * ct, s[8] = st * Ct, this
      }
      getTranslation(a = new tt) {
        return a.set(this.data[12], this.data[13], this.data[14])
      }
      getX(a = new tt) {
        return a.set(this.data[0], this.data[1], this.data[2])
      }
      getY(a = new tt) {
        return a.set(this.data[4], this.data[5], this.data[6])
      }
      getZ(a = new tt) {
        return a.set(this.data[8], this.data[9], this.data[10])
      }
      getScale(a = new tt) {
        return this.getX(Be), this.getY(Ie), this.getZ(Ce), a.set(Be.length(), Ie.length(), Ce.length()), a
      }
      setFromEulerAngles(a, e, s) {
        a *= Zt.DEG_TO_RAD, e *= Zt.DEG_TO_RAD, s *= Zt.DEG_TO_RAD;
        const o = Math.sin(-a),
          h = Math.cos(-a),
          u = Math.sin(-e),
          p = Math.cos(-e),
          _ = Math.sin(-s),
          g = Math.cos(-s),
          k = this.data;
        return k[0] = p * g, k[1] = -p * _, k[2] = u, k[3] = 0, k[4] = h * _ + g * o * u, k[5] = h * g - o * u * _, k[6] = -p * o, k[7] = 0, k[8] = o * _ - h * g * u, k[9] = g * o + h * u * _, k[10] = h * p, k[11] = 0, k[12] = 0, k[13] = 0, k[14] = 0, k[15] = 1, this
      }
      getEulerAngles(a = new tt) {
        this.getScale(xi);
        const e = xi.x,
          s = xi.y,
          o = xi.z;
        if (e === 0 || s === 0 || o === 0) return a.set(0, 0, 0);
        const h = this.data,
          u = Math.asin(-h[2] / e),
          p = Math.PI * .5;
        let _, g;
        return u < p ? u > -p ? (_ = Math.atan2(h[6] / s, h[10] / o), g = Math.atan2(h[1] / e, h[0] / e)) : (g = 0, _ = -Math.atan2(h[4] / s, h[5] / s)) : (g = 0, _ = Math.atan2(h[4] / s, h[5] / s)), a.set(_, u, g).mulScalar(Zt.RAD_TO_DEG)
      }
      toString() {
        return "[" + this.data.join(", ") + "]"
      }
    };
  let Gt = ii;
  Gt.IDENTITY = Object.freeze(new ii), Gt.ZERO = Object.freeze(new ii().set([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
  const sr = {
    create: function () {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (a) {
        const e = Math.random() * 16 | 0;
        return (a === "x" ? e : e & 3 | 8).toString(16)
      })
    }
  };
  class ee {
    constructor(e, s = xt.None) {
      this._break = !1, this._floor = null, this._tags = new Set, this._position = e, this._id = sr.create(), s != xt.None && (this._action = s)
    }
    get id() {
      return this._id
    }
    get action() {
      if (!this._action)
        if (!this.lastMark) this._action = xt.Start;
        else if (!this.nextMark) this._action = xt.End;
      else {
        let e = new Gt().setLookAt(new tt, this._fromDir, tt.UP).invert().mul(new Gt().setTranslate(this._toDir.x, this._toDir.y, this._toDir.z)).getTranslation();
        e.x >= .7 ? this._action = xt.TurnRight : e.x <= -.7 ? this._action = xt.TurnLeft : e.y >= .34 ? this._action = xt.GoUp : e.y <= -.34 ? this._action = xt.GoDown : e.z > .7 ? this._action = xt.GoBack : this._action = xt.None
      }
      return this._action
    }
    set action(e) {
      this._action = e, (this._action == xt.Elevator || this._action == xt.Escalator) && (this._break = !0)
    }
    get nextMark() {
      return this._nextMark
    }
    set nextMark(e) {
      this._nextMark = e, e ? this._toDir = new tt().sub2(e.position, this.position).normalize() : this._toDir = null
    }
    get lastMark() {
      return this._lastMark
    }
    set lastMark(e) {
      this._lastMark = e, e ? this._fromDir = new tt().sub2(this.position, e.position).normalize() : this._fromDir = null
    }
    get position() {
      return this._position
    }
    get blockId() {
      return this._blockId || this.lastMark && this.lastMark.blockId && (this._blockId = this.lastMark.blockId), this._blockId
    }
    set blockId(e) {
      this._blockId = e
    }
    get localPosition() {
      return this._localPosition
    }
    set localPosition(e) {
      this._localPosition = e
    }
    get fromDir() {
      return this._fromDir || (this._fromDir = this._toDir.clone().mulScalar(-1)), this._fromDir
    }
    get toDir() {
      return this._toDir || (this._toDir = this._fromDir.clone().mulScalar(-1)), this._toDir
    }
    get forward() {
      return this._forward || (this._fromDir && this._toDir ? this._forward = new tt().add2(this._fromDir, this._toDir).normalize() : this._fromDir ? this._forward = this._fromDir.clone() : this._toDir && (this._forward = this._toDir.clone())), this._forward
    }
    get distanceFromStart() {
      return this._distanceFromStart || (this.lastMark ? this._distanceFromStart = this.lastMark.distanceFromStart + this.lastMark.distanceToNext : this._distanceFromStart = 0), this._distanceFromStart
    }
    get distanceToNext() {
      return this._distanceToNext || (this._nextMark ? this._distanceToNext = this.position.distance(this._nextMark.position) : this._distanceToNext = 0), this._distanceToNext
    }
    get distanceToEnd() {
      return this._distanceToEnd || (this._nextMark ? this._distanceToEnd = this.distanceToNext + this._nextMark.distanceToEnd : this._distanceToEnd = 0), this._distanceToEnd
    }
    get pose() {
      return this._pose || (this._pose = new Gt().setLookAt(this.position, this.position.clone().add(this.forward), tt.UP)), this._pose
    }
    set break(e) {
      this._break = e
    }
    get break() {
      return this._break
    }
    set floor(e) {
      this._floor = e
    }
    get floor() {
      return this._floor == null && (this.lastMark ? this._floor = this.lastMark.floor : this._floor = 0), this._floor
    }
    inArea(e, s, o = null, h = null) {
      o === null && (o = -s / 2), h === null && (h = s / 2);
      let u = new tt;
      if (this._toDir) return u = new Gt().setLookAt(this.position, this.position.clone().add(this._toDir), tt.UP).invert().mul(new Gt().setTranslate(e.x, e.y, e.z)).getTranslation(), {
        inArea: u.x >= o && u.x <= h && u.y >= -1 && u.y <= 4 && (u.z <= 0 && u.z >= -this.distanceToNext || new he(u.x, u.z).length() <= s / 2),
        zLen: u.z <= 0 ? -u.z : 0,
        xLen: u.x,
        yLen: u.y
      }; {
        let p = new he(e.x, e.z).distance(new he(this.position.x, this.position.z));
        return {
          inArea: e.y - this.position.y >= -1 && e.y - this.position.y <= 4 && p <= s / 2,
          zLen: 0,
          xLen: p
        }
      }
    }
    getMarkerIndexOfDistance(e, s) {
      return this.nextMark ? this.distanceToNext >= e ? ++s : this.nextMark.getMarkerIndexOfDistance(e - this.distanceToNext, ++s) : s
    }
    getNextAction() {
      if (this._nextAction && this._nextAction != xt.None) return {
        action: this._nextAction,
        distance: this._nextActionDistance
      };
      if (!this.nextMark) return {
        action: xt.End,
        distance: 0
      };
      if (this.nextMark.action != xt.None) return this._nextAction = this.nextMark.action, this._nextActionDistance = this.distanceToNext, {
        action: this._nextAction,
        distance: this._nextActionDistance
      }; {
        let {
          action: e,
          distance: s
        } = this.nextMark.getNextAction();
        return this._nextActionDistance = this.distanceToNext + s, this._nextAction = e, {
          action: this._nextAction,
          distance: this._nextActionDistance
        }
      }
    }
    getNextBreakMarker() {
      if (this._nextBreakMarker) return {
        breakMarker: this._nextBreakMarker,
        distance: this._nextBreakDistance
      };
      if (!this.nextMark) return this.break = !0, this._nextBreakMarker = this, this._nextBreakDistance = 0, {
        breakMarker: this._nextBreakMarker,
        distance: this._nextBreakDistance
      };
      if (this.nextMark.break) return this._nextBreakMarker = this.nextMark, this._nextBreakDistance = this.distanceToNext, {
        breakMarker: this._nextBreakMarker,
        distance: this._nextBreakDistance
      }; {
        let {
          breakMarker: e,
          distance: s
        } = this.nextMark.getNextBreakMarker();
        return this._nextBreakDistance = this.distanceToNext + s, this._nextBreakMarker = e, {
          breakMarker: this._nextBreakMarker,
          distance: this._nextBreakDistance
        }
      }
    }
    getPositionInRoute(e, s) {
      let o = e - this.distanceFromStart;
      return o >= 0 && o < this.distanceToNext ? s ? this.getBazerPosition(o) : new tt().add2(this.position, this._toDir.clone().mulScalar(o)) : o >= 0 && o >= this.distanceToNext ? this.nextMark ? this.nextMark.getPositionInRoute(e, s) : this.position : this.lastMark ? this.lastMark.getPositionInRoute(e, s) : this.position
    }
    getBazerPosition(e) {
      const s = e / this.distanceToNext,
        o = this.position.clone(),
        h = new tt().add2(this.position, this.forward.clone().mulScalar(.5)),
        u = new tt().sub2(this.nextMark.position, this.nextMark.forward.clone().mulScalar(.5)),
        p = this.nextMark.position.clone();
      return o.mulScalar(Math.pow(1 - s, 3)).add(h.mulScalar(3 * s * Math.pow(1 - s, 2))).add(u.mulScalar(3 * Math.pow(s, 2) * (1 - s))).add(p.mulScalar(Math.pow(s, 3)))
    }
    addTag(e) {
      this._tags.add(e)
    }
    removeTag(e) {
      this._tags.delete(e)
    }
    hasTag(e) {
      return this._tags.has(e)
    }
    get distanceToNextBreak() {
      return this.getNextBreakMarker(), this._nextBreakDistance
    }
    resetNextBreakMarker() {
      this._nextBreakMarker = null, this._nextBreakDistance = null
    }
  }
  class lt {
    constructor() {
      this._bestArrowDistance = 5, this._currentRouteIndex = -1, this._checkInRouteMaxCount = 5
    }
    get routeWidth() {
      return this._routeWidth
    }
    set routeWidth(e) {
      this._routeWidth = e
    }
    get bestArrowDistance() {
      return this._bestArrowDistance
    }
    set bestArrowDistance(e) {
      this._bestArrowDistance = e
    }
    get checkInRouteMaxCount() {
      return this._checkInRouteMaxCount
    }
    set checkInRouteMaxCount(e) {
      this._checkInRouteMaxCount = e
    }
    static get Instance() {
      return this._instance || (this._instance = new lt), this._instance
    }
    get navPlanManager() {
      return this._navPlanManager || (this._navPlanManager = new Is), this._navPlanManager
    }
    setRoutePlane(e, s, o) {
      !s || s.length <= 0 || (this._rawRoute = s, this.navPlanManager.clear(), this._creatSceneMarkerRoutePlanes(this._rawRoute, e, o), this._sceneMarkerRoute = this.navPlanManager.allSceneMarker, console.log("3d: sceneMarkers:", this._sceneMarkerRoute), this._currentRouteIndex = 0)
    }
    _refineRoute(e, s, o) {
      let h = [],
        u = e.map(k => new tt(k.position.x, k.position.y, k.position.z)),
        p = new tt(s.x, u[0].y, s.z);
      if (u.length >= 2) {
        const k = new tt(u[0].x, u[0].y, u[0].z),
          E = new tt(u[1].x, u[1].y, u[1].z),
          D = new Gt().setLookAt(k, E, tt.UP).invert().mul(new Gt().setTranslate(p.x, p.y, p.z)).getTranslation();
        if (D.z < 0 && (u.shift(), e.shift(), Math.abs(D.x) > this._routeWidth / 2 && k.distance(E) + D.z > this._bestArrowDistance)) {
          const B = k.add(new tt().sub2(E, k).normalize().mulScalar(-D.z));
          u.unshift(B), e.unshift({
            id: "",
            name: "",
            position: {
              x: B.x,
              y: B.y,
              z: B.z
            }
          })
        }
      }
      if (u.unshift(p), e.unshift({
          id: "",
          name: "start",
          position: {
            x: p.x,
            y: p.y,
            z: p.z
          }
        }), o) {
        let k = new tt(o.x, u[u.length - 1].y, o.z);
        if (u.length >= 2) {
          const E = new tt(u[u.length - 1].x, u[u.length - 1].y, u[u.length - 1].z),
            D = new tt(u[u.length - 2].x, u[u.length - 2].y, u[u.length - 2].z),
            B = new Gt().setLookAt(E, D, tt.UP).invert().mul(new Gt().setTranslate(k.x, k.y, k.z)).getTranslation();
          if (B.z < 0 && (u.pop(), Math.abs(B.x) > this._routeWidth / 2 && E.distance(D) + B.z > this._bestArrowDistance)) {
            const O = E.add(new tt().sub2(D, E).normalize().mulScalar(-B.z));
            u.push(O), e.push({
              id: "",
              name: "",
              position: {
                x: O.x,
                y: O.y,
                z: O.z
              }
            })
          }
        }
        u.push(k), e.push({
          id: "",
          name: "end",
          position: {
            x: k.x,
            y: k.y,
            z: k.z
          }
        })
      }
      console.log("3d: posint len", u.length, "  route len:", e.length);
      let _ = k => {
        let E = null;
        return k.name && (k.name.toLocaleLowerCase().indexOf("elevator") >= 0 ? E = xt.Elevator : k.name.toLocaleLowerCase().indexOf("stairs") >= 0 ? E = xt.Stairs : k.name.toLocaleLowerCase().indexOf("escalator") >= 0 && (E = xt.Escalator)), E
      };
      h.push(new ee(u[u.length - 1], _(e[u.length - 1])));
      let g = u[u.length - 1];
      for (let k = u.length - 2; k >= 0; k--) {
        let E = _(e[k]),
          D = g.distance(u[k]);
        if (Math.abs(D - this._bestArrowDistance) < this._bestArrowDistance * .382) {
          let B = new ee(u[k], E);
          B.nextMark = h[h.length - 1], h[h.length - 1].lastMark = B, h.push(B), g = u[k]
        } else if (D < this._bestArrowDistance) {
          if (e[k].name) {
            let B = new ee(u[k], E);
            B.nextMark = h[h.length - 1], h[h.length - 1].lastMark = B, h.push(B), g = u[k]
          } else if (k != 0) {
            const B = u[k].clone().sub(g.clone()).normalize(),
              O = u[k - 1].clone().sub(u[k].clone()).normalize();
            if (B.dot(O) < .866) {
              let H = new ee(u[k], E);
              H.nextMark = h[h.length - 1], h[h.length - 1].lastMark = H, h.push(H), g = u[k]
            }
          }
        } else if (D > this._bestArrowDistance) {
          const B = u[k].clone().sub(g.clone()).normalize();
          let O = new tt().add2(g.clone(), B.clone().mulScalar(this._bestArrowDistance)),
            H = new ee(O, E);
          H.nextMark = h[h.length - 1], h[h.length - 1].lastMark = H, h.push(H), g = O, k++
        }
      }
      return h.reverse()
    }
    _creatSceneMarkerRoutePlanes(e, s, o) {
      let h = null,
        u = null;
      for (let B = 0; B < e.length; B++) {
        let O = this._addSceneMarker(e[B], u, h);
        h == null && (h = O), u = O
      }
      let p = h.floor,
        _ = new tt(s.x, e[0].position.y, s.z);
      if (e.length >= 2) {
        const B = new tt(e[0].position.x, e[0].position.y, e[0].position.z),
          O = new tt(e[1].position.x, e[1].position.y, e[1].position.z),
          H = new Gt().setLookAt(B, O, tt.UP).invert().mul(new Gt().setTranslate(_.x, _.y, _.z)).getTranslation();
        if (H.z < 0 && (h = h.nextMark, h.lastMark = null, console.log("remove head Marker"), Math.abs(H.x) > this._routeWidth / 2 && B.distance(O) + H.z > this._bestArrowDistance)) {
          const Q = B.add(new tt().sub2(O, B).normalize().mulScalar(-H.z));
          let it = new ee(Q);
          it.nextMark = h, h.lastMark = it, h = h.lastMark, console.log("add an marker in head")
        }
      }
      let g = new ee(_, xt.Start);
      if (g.floor = p, g.nextMark = h, h.lastMark = g, h = h.lastMark, console.log("add camera marker as start"), o) {
        let B = new tt(o.x, e[e.length - 1].position.y, o.z);
        if (e.length >= 2) {
          const H = new tt(e[e.length - 1].position.x, e[e.length - 1].position.y, e[e.length - 1].position.z),
            Q = new tt(e[e.length - 2].position.x, e[e.length - 2].position.y, e[e.length - 2].position.z),
            it = new Gt().setLookAt(H, Q, tt.UP).invert().mul(new Gt().setTranslate(B.x, B.y, B.z)).getTranslation();
          if (it.z < 0 && (u = u.lastMark, u.nextMark = null, console.log("remove tail marker"), Math.abs(it.x) > this._routeWidth / 2 && H.distance(Q) + it.z > this._bestArrowDistance)) {
            const V = H.add(new tt().sub2(Q, H).normalize().mulScalar(-it.z));
            let nt = new ee(V);
            nt.lastMark = u, u.nextMark = nt, u = u.nextMark, console.log("add a marker in tail")
          }
        }
        let O = new ee(B, xt.End);
        O.lastMark = u, u.nextMark = O, u = u.nextMark, console.log("add target as end marker")
      }
      let k = h;
      for (; k.nextMark;) k = k.nextMark;
      let E = h,
        D = [];
      do {
        let B = E.getNextBreakMarker();
        D.push(new Ps(E, B.breakMarker)), E = B.breakMarker
      } while (E != u);
      D.forEach(B => {
        this.navPlanManager.addPlan(B)
      }), console.log("nav plan:", this.navPlanManager.plans), console.log("plan length:", this.navPlanManager.planCount)
    }
    _addSceneMarker(e, s, o) {
      var h, u, p, _;
      let g = B => {
        let O = null;
        return B.toLocaleLowerCase().indexOf("elevator") >= 0 ? O = xt.Elevator : B.toLocaleLowerCase().indexOf("stairs") >= 0 ? O = xt.Stairs : B.toLocaleLowerCase().indexOf("escalator") >= 0 && (O = xt.Escalator), O
      };
      const {
        name: k,
        position: E
      } = e, D = new ee(new tt(E.x, E.y, E.z));
      if (e.properties && e.properties["EasyARWenLv:LuWangExtension"]) {
        const {
          floor: B,
          tag: O,
          isBreak: H
        } = e.properties["EasyARWenLv:LuWangExtension"];
        D.break = H;
        const Q = g(O);
        D.action = Q, D.floor = B, o && o.floor == 0 && (o.floor = B)
      } else {
        const B = g(k);
        D.action = B
      }
      if (e.floor && (D.floor = e.floor), e.isBreak && (D.break = e.isBreak), s && (D.lastMark = s, s.nextMark = D), (u = (h = e.origin) == null ? void 0 : h.transform) != null && u.position) {
        const {
          x: B,
          y: O,
          z: H
        } = e.origin.transform.position;
        let Q = new tt(B, O, H);
        D.localPosition = Q
      }
      return (_ = (p = e.origin) == null ? void 0 : p.parent) != null && _.id && (D.blockId = e.origin.parent.id), D
    }
    getRoute(e, s) {
      if (!this._sceneMarkerRoute || this._sceneMarkerRoute.length <= 0) return null;
      let o = {},
        h = this._checkInRouteMaxCount;
      if (this._checkInRoute(e, this._currentRouteIndex, h, o)) {
        this._currentRouteIndex = o.markerIndex;
        const u = this._sceneMarkerRoute[this._currentRouteIndex];
        let p = this.navPlanManager.getPlanOfMarkerIndex(this._currentRouteIndex, !0);
        if (!p) {
          console.error("\u5F53\u524Dmarker\u4E0D\u5C5E\u4E8E\u4EFB\u4F55plan");
          debugger
        }
        const _ = {
          distanceFromStart: -1,
          distanceFromLastBreak: -1,
          distanceToEnd: -1,
          distanceToNextBreak: -1,
          nextAction: xt.None,
          distanceToNextAction: -1,
          offsetFirstMark: 0,
          inBreak: !1,
          route: []
        };
        let g;
        _.distanceToEnd = u.distanceToEnd - o.zLen, _.distanceFromStart = this._sceneMarkerRoute[0].distanceToEnd - _.distanceToEnd, _.distanceToNextBreak = u.distanceToNextBreak - o.zLen, _.distanceFromLastBreak = p ? p.pathLength - _.distanceToNextBreak : 0;
        let {
          action: k,
          distance: E
        } = u.getNextAction();
        _.nextAction = k, _.distanceToNextAction = E - o.zLen, _.offsetFirstMark = o.zLen, _.inBreak = p ? !p.needDraw : !0, _.distanceToNextBreak <= s || s == -1 ? p ? g = this._sceneMarkerRoute.slice(this._currentRouteIndex, p.endIndex + 1) : g = this._sceneMarkerRoute.slice(this._currentRouteIndex, u.getMarkerIndexOfDistance(s, this._currentRouteIndex) + 1) : g = this._sceneMarkerRoute.slice(this._currentRouteIndex, u.getMarkerIndexOfDistance(s, this._currentRouteIndex) + 1), _.route = g;
        let D = this.getPositionInRoute(_.distanceFromStart),
          B = new ee(D);
        return B.blockId = u.blockId, _.fullRoute = this._sceneMarkerRoute.slice(0), _.fullRoute.splice(this._currentRouteIndex + 1, 0, B), _.cameraMarkerIndex = this._currentRouteIndex + 1, _
      } else return null
    }
    getPositionInRoute(e, s = !1) {
      return this._sceneMarkerRoute ? this._sceneMarkerRoute[this._currentRouteIndex].getPositionInRoute(e, s) : null
    }
    _checkInRoute(e, s, o, h = {}, u = "b") {
      if (!this._sceneMarkerRoute || s < 0 || s >= this._sceneMarkerRoute.length || o <= 0) return !1;
      o--;
      const p = this._sceneMarkerRoute[s];
      p.break && (u = "r");
      let _ = this._sceneMarkerRoute[s].inArea(e, this._routeWidth);
      if (h.markerIndex = s, h.zLen = _.zLen, h.xLen = _.xLen, _.inArea) {
        let g = {
          markerIndex: -1,
          zLen: -1,
          xLen: -1
        };
        return p.nextMark && p.nextMark.break || this._checkInRoute(e, s + 1, 2, g, "r") && Math.abs(g.xLen) < Math.abs(h.xLen) && (h.markerIndex = g.markerIndex, h.zLen = g.zLen, h.xLen = g.xLen), !0
      } else {
        if (u == "b") return this._checkInRoute(e, s + 1, o, h, "r") || this._checkInRoute(e, s - 1, o, h, "l");
        if (u == "r") return this._checkInRoute(e, s + 1, o, h, "r");
        if (u == "l") return this._checkInRoute(e, s - 1, o, h, "l")
      }
    }
    clear() {
      this._rawRoute = null, this._sceneMarkerRoute = null, this._currentRouteIndex = -1, this._navPlanManager = null
    }
    get routeLength() {
      return this._sceneMarkerRoute.length ? this._sceneMarkerRoute[0].distanceToEnd : 0
    }
    get currentPlanBreakFromStart() {
      return this.navPlanManager.currentPlan.endMarker.distanceFromStart
    }
    getMarker(e) {
      if (e >= 0 && e <= this._sceneMarkerRoute.length - 1) return this._sceneMarkerRoute[e];
      console.error("get marker index out of length")
    }
    get markerCount() {
      return this._sceneMarkerRoute.length
    }
    get matkers() {
      return this._sceneMarkerRoute
    }
    getBrekInfo() {
      if (this._navPlanManager.currentPlan.needDraw) {
        if (this._navPlanManager.currentPlan.nextPlan && !this._navPlanManager.currentPlan.nextPlan.needDraw) return this._navPlanManager.currentPlan.nextPlan.info
      } else return this._navPlanManager.currentPlan.info
    }
    setNextRoutePlan() {
      let e = this.navPlanManager.getNextViablePlan();
      console.log("\u8BBE\u7F6E\u5F53\u524Dmarker \u4E3A\uFF1A", e.startIndex, e.startMarker), this._currentRouteIndex = e.startIndex
    }
  }
  const ki = class {
    constructor() {
      const a = new Float32Array(9);
      a[0] = a[4] = a[8] = 1, this.data = a
    }
    clone() {
      return new ki().copy(this)
    }
    copy(a) {
      const e = a.data,
        s = this.data;
      return s[0] = e[0], s[1] = e[1], s[2] = e[2], s[3] = e[3], s[4] = e[4], s[5] = e[5], s[6] = e[6], s[7] = e[7], s[8] = e[8], this
    }
    set(a) {
      const e = this.data;
      return e[0] = a[0], e[1] = a[1], e[2] = a[2], e[3] = a[3], e[4] = a[4], e[5] = a[5], e[6] = a[6], e[7] = a[7], e[8] = a[8], this
    }
    equals(a) {
      const e = this.data,
        s = a.data;
      return e[0] === s[0] && e[1] === s[1] && e[2] === s[2] && e[3] === s[3] && e[4] === s[4] && e[5] === s[5] && e[6] === s[6] && e[7] === s[7] && e[8] === s[8]
    }
    isIdentity() {
      const a = this.data;
      return a[0] === 1 && a[1] === 0 && a[2] === 0 && a[3] === 0 && a[4] === 1 && a[5] === 0 && a[6] === 0 && a[7] === 0 && a[8] === 1
    }
    setIdentity() {
      const a = this.data;
      return a[0] = 1, a[1] = 0, a[2] = 0, a[3] = 0, a[4] = 1, a[5] = 0, a[6] = 0, a[7] = 0, a[8] = 1, this
    }
    toString() {
      return "[" + this.data.join(", ") + "]"
    }
    transpose() {
      const a = this.data;
      let e;
      return e = a[1], a[1] = a[3], a[3] = e, e = a[2], a[2] = a[6], a[6] = e, e = a[5], a[5] = a[7], a[7] = e, this
    }
    setFromMat4(a) {
      const e = a.data,
        s = this.data;
      return s[0] = e[0], s[1] = e[1], s[2] = e[2], s[3] = e[4], s[4] = e[5], s[5] = e[6], s[6] = e[8], s[7] = e[9], s[8] = e[10], this
    }
    transformVector(a, e = new tt) {
      const s = this.data,
        o = a.x,
        h = a.y,
        u = a.z;
      return e.x = o * s[0] + h * s[3] + u * s[6], e.y = o * s[1] + h * s[4] + u * s[7], e.z = o * s[2] + h * s[5] + u * s[8], e
    }
  };
  let Ni = ki;
  Ni.IDENTITY = Object.freeze(new ki), Ni.ZERO = Object.freeze(new ki().set([0, 0, 0, 0, 0, 0, 0, 0, 0]));
  const Ai = class {
    constructor(a = 0, e = 0, s = 0, o = 1) {
      a.length === 4 ? (this.x = a[0], this.y = a[1], this.z = a[2], this.w = a[3]) : (this.x = a, this.y = e, this.z = s, this.w = o)
    }
    clone() {
      return new Ai(this.x, this.y, this.z, this.w)
    }
    conjugate() {
      return this.x *= -1, this.y *= -1, this.z *= -1, this
    }
    copy(a) {
      return this.x = a.x, this.y = a.y, this.z = a.z, this.w = a.w, this
    }
    equals(a) {
      return this.x === a.x && this.y === a.y && this.z === a.z && this.w === a.w
    }
    getAxisAngle(a) {
      let e = Math.acos(this.w) * 2;
      const s = Math.sin(e / 2);
      return s !== 0 ? (a.x = this.x / s, a.y = this.y / s, a.z = this.z / s, (a.x < 0 || a.y < 0 || a.z < 0) && (a.x *= -1, a.y *= -1, a.z *= -1, e *= -1)) : (a.x = 1, a.y = 0, a.z = 0), e * Zt.RAD_TO_DEG
    }
    getEulerAngles(a = new tt) {
      let e, s, o;
      const h = this.x,
        u = this.y,
        p = this.z,
        _ = this.w,
        g = 2 * (_ * u - h * p);
      return g <= -.99999 ? (e = 2 * Math.atan2(h, _), s = -Math.PI / 2, o = 0) : g >= .99999 ? (e = 2 * Math.atan2(h, _), s = Math.PI / 2, o = 0) : (e = Math.atan2(2 * (_ * h + u * p), 1 - 2 * (h * h + u * u)), s = Math.asin(g), o = Math.atan2(2 * (_ * p + h * u), 1 - 2 * (u * u + p * p))), a.set(e, s, o).mulScalar(Zt.RAD_TO_DEG)
    }
    invert() {
      return this.conjugate().normalize()
    }
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w)
    }
    lengthSq() {
      return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
    }
    mul(a) {
      const e = this.x,
        s = this.y,
        o = this.z,
        h = this.w,
        u = a.x,
        p = a.y,
        _ = a.z,
        g = a.w;
      return this.x = h * u + e * g + s * _ - o * p, this.y = h * p + s * g + o * u - e * _, this.z = h * _ + o * g + e * p - s * u, this.w = h * g - e * u - s * p - o * _, this
    }
    mul2(a, e) {
      const s = a.x,
        o = a.y,
        h = a.z,
        u = a.w,
        p = e.x,
        _ = e.y,
        g = e.z,
        k = e.w;
      return this.x = u * p + s * k + o * g - h * _, this.y = u * _ + o * k + h * p - s * g, this.z = u * g + h * k + s * _ - o * p, this.w = u * k - s * p - o * _ - h * g, this
    }
    normalize() {
      let a = this.length();
      return a === 0 ? (this.x = this.y = this.z = 0, this.w = 1) : (a = 1 / a, this.x *= a, this.y *= a, this.z *= a, this.w *= a), this
    }
    set(a, e, s, o) {
      return this.x = a, this.y = e, this.z = s, this.w = o, this
    }
    setFromAxisAngle(a, e) {
      e *= .5 * Zt.DEG_TO_RAD;
      const s = Math.sin(e),
        o = Math.cos(e);
      return this.x = s * a.x, this.y = s * a.y, this.z = s * a.z, this.w = o, this
    }
    setFromEulerAngles(a, e, s) {
      if (a instanceof tt) {
        const E = a;
        a = E.x, e = E.y, s = E.z
      }
      const o = .5 * Zt.DEG_TO_RAD;
      a *= o, e *= o, s *= o;
      const h = Math.sin(a),
        u = Math.cos(a),
        p = Math.sin(e),
        _ = Math.cos(e),
        g = Math.sin(s),
        k = Math.cos(s);
      return this.x = h * _ * k - u * p * g, this.y = u * p * k + h * _ * g, this.z = u * _ * g - h * p * k, this.w = u * _ * k + h * p * g, this
    }
    setFromMat4(a) {
      let e, s, o, h, u, p, _, g, k, E, D, B, O, H;
      if (a = a.data, e = a[0], s = a[1], o = a[2], h = a[4], u = a[5], p = a[6], _ = a[8], g = a[9], k = a[10], B = e * e + s * s + o * o, B === 0) return this;
      if (B = 1 / Math.sqrt(B), O = h * h + u * u + p * p, O === 0) return this;
      if (O = 1 / Math.sqrt(O), H = _ * _ + g * g + k * k, H === 0) return this;
      H = 1 / Math.sqrt(H), e *= B, s *= B, o *= B, h *= O, u *= O, p *= O, _ *= H, g *= H, k *= H;
      const Q = e + u + k;
      return Q >= 0 ? (E = Math.sqrt(Q + 1), this.w = E * .5, E = .5 / E, this.x = (p - g) * E, this.y = (_ - o) * E, this.z = (s - h) * E) : e > u ? e > k ? (D = e - (u + k) + 1, D = Math.sqrt(D), this.x = D * .5, D = .5 / D, this.w = (p - g) * D, this.y = (s + h) * D, this.z = (o + _) * D) : (D = k - (e + u) + 1, D = Math.sqrt(D), this.z = D * .5, D = .5 / D, this.w = (s - h) * D, this.x = (_ + o) * D, this.y = (g + p) * D) : u > k ? (D = u - (k + e) + 1, D = Math.sqrt(D), this.y = D * .5, D = .5 / D, this.w = (_ - o) * D, this.z = (p + g) * D, this.x = (h + s) * D) : (D = k - (e + u) + 1, D = Math.sqrt(D), this.z = D * .5, D = .5 / D, this.w = (s - h) * D, this.x = (_ + o) * D, this.y = (g + p) * D), this
    }
    slerp(a, e, s) {
      const o = a.x,
        h = a.y,
        u = a.z,
        p = a.w;
      let _ = e.x,
        g = e.y,
        k = e.z,
        E = e.w,
        D = p * E + o * _ + h * g + u * k;
      if (D < 0 && (E = -E, _ = -_, g = -g, k = -k, D = -D), Math.abs(D) >= 1) return this.w = p, this.x = o, this.y = h, this.z = u, this;
      const B = Math.acos(D),
        O = Math.sqrt(1 - D * D);
      if (Math.abs(O) < .001) return this.w = p * .5 + E * .5, this.x = o * .5 + _ * .5, this.y = h * .5 + g * .5, this.z = u * .5 + k * .5, this;
      const H = Math.sin((1 - s) * B) / O,
        Q = Math.sin(s * B) / O;
      return this.w = p * H + E * Q, this.x = o * H + _ * Q, this.y = h * H + g * Q, this.z = u * H + k * Q, this
    }
    transformVector(a, e = new tt) {
      const s = a.x,
        o = a.y,
        h = a.z,
        u = this.x,
        p = this.y,
        _ = this.z,
        g = this.w,
        k = g * s + p * h - _ * o,
        E = g * o + _ * s - u * h,
        D = g * h + u * o - p * s,
        B = -u * s - p * o - _ * h;
      return e.x = k * g + B * -u + E * -_ - D * -p, e.y = E * g + B * -p + D * -u - k * -_, e.z = D * g + B * -_ + k * -p - E * -u, e
    }
    toString() {
      return `[${this.x}, ${this.y}, ${this.z}, ${this.w}]`
    }
  };
  let qi = Ai;
  qi.IDENTITY = Object.freeze(new Ai(0, 0, 0, 1)), qi.ZERO = Object.freeze(new Ai(0, 0, 0, 0));
  class He {}
  const Vi = "endModel",
    $i = "elevatorModel",
    ji = "downStairModel",
    Hi = "upStairModel",
    Gi = "turnLeftModel",
    Wi = "turnRightModel";
  class Ge {
    init(e, s, o, h) {
      this.pc = s, this.app = e, this.pathRoot = h, this.objectInScene = new Map
    }
    clearPath() {
      for (let e of this.objectInScene.keys()) vt.Instance.destroy(this.objectInScene.get(e)), this.objectInScene.delete(e)
    }
    setModels(e) {
      console.log("setModels", e), this.clearPath(), e.endModel ? (e.endModel.name = Vi, vt.Instance.register(e.endModel, 1)) : vt.Instance.register(new this.pc.Entity(Vi), 1), e.elevatorModel ? (e.elevatorModel.name = $i, vt.Instance.register(e.elevatorModel, 1)) : vt.Instance.register(new this.pc.Entity($i), 1), e.downStairModel ? (e.downStairModel.name = ji, vt.Instance.register(e.downStairModel, 1)) : vt.Instance.register(new this.pc.Entity(ji), 1), e.upStairModel ? (e.upStairModel.name = Hi, vt.Instance.register(e.upStairModel, 1)) : vt.Instance.register(new this.pc.Entity(Hi), 1), e.turnLeftModel ? (e.turnLeftModel.name = Gi, vt.Instance.register(e.turnLeftModel, 1)) : vt.Instance.register(new this.pc.Entity(Gi), 1), e.turnRightModel ? (e.turnRightModel.name = Wi, vt.Instance.register(e.turnRightModel, 1)) : vt.Instance.register(new this.pc.Entity(Wi), 1)
    }
    drawPath(e) {
      let s = e.route.map(h => h.id),
        o = this.objectInScene.keys();
      for (let h of o) s.includes(h) || (vt.Instance.destroy(this.objectInScene.get(h)), this.objectInScene.delete(h));
      for (let h of e.route) {
        if (this.objectInScene.has(h.id)) continue;
        let u = null;
        if (h.action == xt.Elevator && !h.hasTag(oe.WormholeEnd)) {
          u = $i;
          let p = h.position.clone().add(h.fromDir),
            _ = this.createModel(u, h.position, p);
          this.objectInScene.set(h.id, _)
        } else if (h.action == xt.End) {
          u = Vi;
          let p = h.position.clone().add(h.fromDir),
            _ = this.createModel(u, h.position, p);
          this.objectInScene.set(h.id, _)
        } else if ((h.action == xt.Escalator || h.action == xt.Stairs) && !h.hasTag(oe.WormholeEnd) && h.hasTag(oe.WormholeStart)) {
          let p = lt.Instance.navPlanManager.getPlanOfMarkerIndex(lt.Instance.matkers.indexOf(h), !1);
          if (p.info.crossFloor > 0) {
            u = Hi;
            let _ = h.position.clone().add(h.fromDir),
              g = this.createModel(u, h.position, _);
            this.objectInScene.set(h.id, g)
          } else if (p.info.crossFloor < 0) {
            u = ji;
            let _ = h.position.clone().add(h.fromDir),
              g = this.createModel(u, h.position, _);
            this.objectInScene.set(h.id, g)
          }
        } else if (h.action == xt.TurnLeft) {
          u = Gi;
          let p = new tt().cross(h.toDir, h.fromDir),
            _ = new tt().cross(p, h.toDir).normalize(),
            g = h.position.clone().add(_),
            k = this.createModel(u, h.position, g);
          this.objectInScene.set(h.id, k)
        } else if (h.action == xt.TurnRight) {
          u = Wi;
          let p = new tt().cross(h.toDir, h.fromDir),
            _ = new tt().cross(p, h.toDir).normalize(),
            g = h.position.clone().add(_),
            k = this.createModel(u, h.position, g);
          this.objectInScene.set(h.id, k)
        }
      }
    }
    createModel(e, s, o) {
      let h = vt.Instance.create(e);
      return h ? (h.reparent(this.pathRoot), h.setPosition(s.x, s.y, s.z), o && h.lookAt(o.x, o.y, o.z, 0, 1, 0), h) : null
    }
    destroy() {
      this.clearPath()
    }
  }
  const Ki = "routeArrow";
  class Fs extends He {
    init(e, s, o) {
      this.app = e, this.pc = s, this.pathRoot = new this.pc.Entity("pathRoot", e), this.app.root.children[0].addChild(this.pathRoot), this.arrowsMap = new Map, this.pathObjects = new Ge, this.pathObjects.init(e, s, o, this.pathRoot)
    }
    setModels(e) {
      this.clearPath(), e.routeArrow ? (this.routeArrow = e.routeArrow, this.routeArrow.name = Ki, vt.Instance.register(this.routeArrow, 50)) : vt.Instance.register(new this.pc.Entity(Ki), 50), this.pathObjects.setModels(e)
    }
    clearPath() {
      this.pathObjects.clearPath();
      for (let e of this.arrowsMap.keys()) vt.Instance.destroy(this.arrowsMap.get(e)), this.arrowsMap.delete(e)
    }
    drawPath(e) {
      this.pathObjects.drawPath(e);
      let s = e.route.map(h => h.id),
        o = this.arrowsMap.keys();
      for (let h of o) s.includes(h) || (vt.Instance.destroy(this.arrowsMap.get(h)), this.arrowsMap.delete(h));
      for (let h of e.route)
        if (!this.arrowsMap.has(h.id) && !(h.action == xt.Elevator || h.action == xt.End) && h.action != xt.Escalator && h.action != xt.Stairs) {
          let u = vt.Instance.create(Ki);
          u.reparent(this.pathRoot), u.setPosition(h.position.x, h.position.y, h.position.z);
          let p = h.position.clone().add(h.toDir);
          u.lookAt(p.x, p.y, p.z, 0, 1, 0), this.arrowsMap.set(h.id, u)
        }
    }
    onCameraUpdate(e, s) {}
    destroy() {
      this.clearPath(), this.routeArrow.destroy(), this.routeArrow = null, this.pathObjects.destroy(), this.pathRoot.destroy()
    }
  }
  class Ds {
    constructor() {
      this._lookAtDistance = 5
    }
    init(e, s, o, h = {
      x: 0,
      y: -.35,
      z: -1
    }, u = 5) {
      this.pc = e, this.app = s, this.cameraEntity = o, this._lookAtDistance = u, this.offsetCamera = h, this.app.on("update", this.update, this), this.arrowEntity = new e.Entity("flowArrow", this.app), this.arrowEntity.enabled = !1
    }
    setModel(e) {
      this.arrowEntity && this.arrowEntity.destroy(), this.arrowEntity = e, this.arrowEntity.enabled = !1, this.cameraEntity.addChild(this.arrowEntity), this.arrowEntity.setLocalPosition(this.offsetCamera.x, this.offsetCamera.y, this.offsetCamera.z)
    }
    onCameraUpdate(e, s) {
      this._targetPosition = lt.Instance.getPositionInRoute(s + this._lookAtDistance), this.arrowEntity.enabled || (this.arrowEntity.enabled = !0)
    }
    update(e) {
      if (this.arrowEntity.enabled && this._targetPosition) {
        let s = this.arrowEntity.getPosition().clone(),
          o = new this.pc.Mat4().setLookAt(s, new this.pc.Vec3(this._targetPosition.x, s.y, this._targetPosition.z), this.pc.Vec3.UP),
          h = new this.pc.Quat().setFromMat4(o);
        this.arrowEntity.setRotation(new this.pc.Quat().slerp(this.arrowEntity.getRotation().clone(), h, e * 2))
      }
    }
    hide() {
      this.arrowEntity.enabled = !1
    }
    detroy() {
      this.app.off("update", this.update, this), this.arrowEntity.destroy()
    }
  }
  const ar = {
    routeWidth: 6,
    arriveRadious: 5,
    drawPathLength: -1,
    modelTinyApp: {
      routeModels: "https://sightp-tour-tiny-app.sightp.com/qmytest/Default_2D_0/tinyapp.json",
      navigatorModel: "https://sightp-tour-tiny-app.sightp.com/TinyAssistant/pandakouxing_2024_04_10-14_47_55/tinyapp.json",
      targetFinderModel: "https://sightp-tour-tiny-app.sightp.com/TinyAssistant/TargetFinder2_2024_04_18-12_15_44/tinyapp.json"
    },
    pathSetting: {
      disable: !1,
      pathType: Ae.AverageArrowPath,
      arrowDistance: 3
    },
    flowArrowSetting: {
      disable: !0,
      offsetCamera: {
        x: 0,
        y: -.35,
        z: -1
      },
      lookDistance: 8
    },
    navigator: {
      disable: !1,
      assistantMode: !1,
      moveSpeed: 1.2,
      maxMoveSpeed: 1.9,
      maxWaitDistance: 8,
      minWaitDistance: 2,
      maxRunDistance: 5,
      minRunDistance: .9
    }
  };

  function zs(a, e = ar) {
    for (let s in e) typeof e[s] == "object" ? (a[s] == null && (a[s] = {}), zs(a[s], e[s])) : a[s] == null && (a[s] = e[s]);
    return a
  }
  class Ls {
    constructor(e) {
      this.navManager = e
    }
    init(e, s, o) {
      this.app = e, this.pc = s, this.assistantMode = o.assistantMode, this.navigatorEntity = new this.pc.Entity("navigatorEntity", e), this.movespeed = o.moveSpeed, this.maxMoveSpeed = o.maxMoveSpeed, this.maxWaitDistance = o.maxWaitDistance, this.minWaitDistance = o.minWaitDistance, this.minRunDistance = o.minRunDistance, this.maxRunDistance = o.maxRunDistance, e.root.children[0].addChild(this.navigatorEntity), this.navigatorEntity.enabled = !1, this.app.on("update", this.update, this), this.setState(0)
    }
    setAssistantPlugin(e) {
      this.assistantPlugin = e, this.assistantMode || setTimeout(() => {
        this.assistantPlugin.assistantTinyRoot.setActive(this.navigatorEntity.enabled), console.log("set assistant active", this.navigatorEntity.enabled)
      });
      let s = this.assistantPlugin.assistantTinyRoot.rootEntity;
      this.assistantEntity = s, this.state == 2 ? this.navManager.fire("assistant_playAnim", "walk") : this.state == 3 ? this.navManager.fire("assistant_playAnim", "run") : this.state == 4 ? this.navManager.fire("assistant_playAnim", "idle") : this.state == 6 && this.navManager.fire("assistant_playAnim", "stop")
    }
    setState(e) {
      switch (e) {
        case 0: {
          console.log("----set navigator state --- BeforeStart"), this.app.fire("navigator_beforeStart"), this.currentDTS = 0, this.cameraDTS = 0, this.assistantMode || this.hide();
          break
        }
        case 1: {
          console.log("----set navigator state --- Start"), this.currentDTS = this.cameraDTS + 3;
          let s = lt.Instance.getPositionInRoute(this.currentDTS, !0);
          this.navigatorEntity.setPosition(s.x, s.y, s.z);
          let o = this.cameraEntity.getPosition();
          this.navigatorEntity.lookAt(o.x, s.y, o.z, 0, 1, 0), this.navigatorEntity.enabled = !0, this.app.fire("navigator_start", s, new this.pc.Vec3(o.x, s.y, o.z)), this.assistantMode ? this.assistantEntity && this.assistantEntity.getPosition().distance(s) < 5 ? (this.navManager.fire("assistant_moveToPosition", new this.pc.Vec3(s.x, s.y, s.z)), this.navManager.once("assistant_move_end", () => {
            this.state != 7 && this.setState(2)
          }, this)) : (this.navManager.fire("assistant_move", new this.pc.Vec3(s.x, s.y, s.z), new this.pc.Vec3(o.x, s.y, o.z)), setTimeout(() => {
            this.state != 7 && this.setState(2)
          }, 2 * 1e3)) : (this.navManager.fire("assistant_move", new this.pc.Vec3(s.x, s.y, s.z), new this.pc.Vec3(o.x, s.y, o.z)), this.assistantPlugin && this.assistantPlugin.assistantTinyRoot.setActive(!0), setTimeout(() => {
            this.state != 7 && this.setState(2)
          }, 2 * 1e3)), this.assistantPlugin ? this.app.fire("setFinderTarget", this.assistantPlugin.assistantTinyRoot.rootEntity.children[0]) : this.app.fire("setFinderTarget", this.navigatorEntity);
          break
        }
        case 2: {
          console.log("----set navigator state --- Walk"), this.app.fire("navigator_walk"), this.navManager.fire("assistant_playAnim", "walk"), this.currentSpeed = this.movespeed;
          break
        }
        case 3: {
          console.log("----set navigator state --- Run"), this.app.fire("navigator_run"), this.navManager.fire("assistant_playAnim", "run"), this.currentSpeed = this.maxMoveSpeed;
          break
        }
        case 4: {
          console.log("----set navigator state --- Wait"), this.app.fire("navigator_wait");
          let s = this.cameraEntity.getPosition();
          this.navigatorEntity.lookAt(s.x, this.navigatorEntity.getPosition().y, s.z, 0, 1, 0), this.currentSpeed = 0, this.navManager.fire("assistant_playAnim", "idle"), this.navManager.fire("assistant_move", this.navigatorEntity.getPosition(), new this.pc.Vec3(s.x, this.navigatorEntity.getPosition().y, s.z));
          break
        }
        case 5: {
          console.log("----set navigator state --- Reset"), this.app.fire("navigator_reset"), this.hide(), this.currentDTS = 0, this.cameraDTS = 0;
          break
        }
        case 6: {
          console.log("----set navigator state --- Stop"), this.app.fire("navigator_stop"), this.currentSpeed = 0, this.navManager.fire("assistant_playAnim", "stop"), this.navManager.fire("assistant_move", this.navigatorEntity.getPosition(), new this.pc.Vec3(this.cameraEntity.getPosition().x, this.navigatorEntity.getPosition().y, this.cameraEntity.getPosition().z)), this.navigatorEntity.rotateLocal(0, 180, 0);
          break
        }
        case 7: {
          console.log("----set navigator state --- Over"), this.app.fire("navigator_over"), this.currentDTS = 0, this.cameraDTS = 0, this.assistantMode || this.hide(), this.app.fire("setFinderTarget", null);
          break
        }
      }
      this.state = e
    }
    onCameraUpdate(e, s) {
      this.cameraEntity || (this.cameraEntity = e), this.cameraDTS = s, this.state == 0 ? this.setState(1) : this.state == 1 ? this.cameraDTS - this.currentDTS >= 1 && (console.log("\u7528\u6237\u8D85\u8FC7\u6570\u5B57\u4EBA\uFF0C\u76F4\u63A5\u5207\u6362"), this.setState(2)) : this.state == 5 ? (this.currentDTS = this.cameraDTS + 1, this.navigatorEntity.enabled = !0, this.assistantPlugin && this.assistantPlugin.assistantTinyRoot.setActive(!0), this.setState(2)) : this.state == 7 && this.setState(1)
    }
    update(e) {
      if (!(this.state <= 0))
        if (this.state == 2 || this.state == 3) {
          const s = lt.Instance.currentPlanBreakFromStart - this.currentDTS <= 5;
          this.currentDTS += this.currentSpeed * e;
          let o = lt.Instance.getPositionInRoute(this.currentDTS, !0);
          this.navigatorEntity.setPosition(o.x, o.y, o.z);
          let h = lt.Instance.getPositionInRoute(this.currentDTS + this.currentSpeed * e, !0);
          if (this.navigatorEntity.lookAt(h.x, o.y, h.z, 0, 1, 0), this.app.fire("navigator_move", o, new this.pc.Vec3(h.x, o.y, h.z)), this.navManager.fire("assistant_move", new this.pc.Vec3(o.x, o.y, o.z), new this.pc.Vec3(h.x, o.y, h.z)), Number.isNaN(this.navigatorEntity.getPosition().x) || Number.isNaN(this.navigatorEntity.getRotation().x)) debugger;
          s && this.state != 3 && this.setState(3), lt.Instance.currentPlanBreakFromStart - this.currentDTS <= 1 ? this.setState(6) : this.currentDTS - this.cameraDTS > this.maxWaitDistance && !s ? this.setState(4) : this.currentDTS - this.cameraDTS < this.minRunDistance && this.state == 2 ? this.setState(3) : this.currentDTS - this.cameraDTS > this.maxRunDistance && this.state == 3 && !s ? this.setState(2) : this.currentDTS - this.cameraDTS < -5 && this.setState(5)
        } else this.state == 4 && this.currentDTS - this.cameraDTS <= this.minWaitDistance && this.setState(2)
    }
    hide() {
      this.navigatorEntity.enabled = !1, this.assistantPlugin && this.assistantPlugin.assistantTinyRoot.setActive(!1)
    }
    reset() {
      this.setState(5)
    }
    over() {
      this.setState(7)
    }
    destroy() {
      this.app.off("update", this.update, this), this.navigatorEntity.destroy(), this.assistantMode || this.assistantPlugin.assistantTinyRoot.destroy()
    }
  }
  class Bs extends He {
    init(e, s, o) {
      this.app = e, this.pc = s, this.pathRoot = new this.pc.Entity("pathRoot", e), this.app.root.children[0].addChild(this.pathRoot), this.pathObjects = new Ge, this.pathObjects.init(e, s, o, this.pathRoot)
    }
    setModels(e) {
      this.clearPath(), this.pathObjects.setModels(e)
    }
    clearPath() {
      this.pathObjects.clearPath()
    }
    drawPath(e) {
      this.pathObjects.drawPath(e)
    }
    onCameraUpdate(e, s) {}
    destroy() {
      this.clearPath(), this.pathObjects.destroy(), this.pathRoot.destroy()
    }
  }
  const Yi = "routeArrow";
  class Os extends He {
    init(e, s, o) {
      this.app = e, this.pc = s, this._drawPathLength = o.drawPathLength == -1 ? Number.MAX_VALUE : o.drawPathLength, this._arrowDistance = o.arrowDistance, this._moveSpeed = o.moveSpeed ? o.moveSpeed : .5, this.pathRoot = new this.pc.Entity("pathRoot", e), this.app.root.children[0].addChild(this.pathRoot), this.pathObjects = new Ge, this.pathObjects.init(e, s, o, this.pathRoot)
    }
    setModels(e) {
      this.clearPath(), e.routeArrow ? (this.routeArrow = e.routeArrow, this.routeArrow.name = Yi, vt.Instance.register(this.routeArrow, 50)) : vt.Instance.register(new this.pc.Entity(Yi), 50), this.pathObjects.setModels(e)
    }
    clearPath() {
      if (this.pathObjects.clearPath(), this._moveOffset = 0, this.app.off("update", this.update, this), this._dtsArrowMap) {
        for (let e of this._dtsArrowMap) e[1] != null && vt.Instance.destroy(e[1]);
        this._dtsArrowMap.clear(), this._dtsArrowMap = null
      }
    }
    drawPath(e) {
      this.pathObjects.drawPath(e);
      const s = e.distanceFromStart;
      if (!this._dtsArrowMap || this._dtsArrowMap.size <= 0) {
        this._dtsArrowMap = new Map;
        let u = lt.Instance.routeLength,
          p = 0;
        for (; p <= u;) this._dtsArrowMap.set(p, null), p += this._arrowDistance;
        this.app.on("update", this.update, this), this._moveOffset = 0
      }
      let o = s - 1 >= 0 ? s - 1 : 0,
        h = s + this._drawPathLength >= lt.Instance.currentPlanBreakFromStart ? lt.Instance.currentPlanBreakFromStart : s + this._drawPathLength;
      for (let u of this._dtsArrowMap.keys())
        if (u >= o && u <= h - this._arrowDistance) {
          if (this._dtsArrowMap.get(u) == null) {
            let p = vt.Instance.create(Yi);
            p.reparent(this.pathRoot);
            let _ = lt.Instance.getPositionInRoute(u + this._moveOffset, !0);
            p.setPosition(_.x, _.y, _.z);
            let g = lt.Instance.getPositionInRoute(u + this._moveOffset + .1, !0);
            p.lookAt(g.x, g.y, g.z), this._dtsArrowMap.set(u, p)
          }
        } else this._dtsArrowMap.get(u) != null && (vt.Instance.destroy(this._dtsArrowMap.get(u)), this._dtsArrowMap.set(u, null))
    }
    onCameraUpdate(e, s) {}
    update(e) {
      if (this._moveOffset = this._moveOffset + e * this._moveSpeed, this._moveOffset > this._arrowDistance && (this._moveOffset = this._moveOffset - this._arrowDistance), this._dtsArrowMap && this._dtsArrowMap.size > 0)
        for (let s of this._dtsArrowMap.keys()) {
          let o = this._dtsArrowMap.get(s);
          if (o) {
            let h = lt.Instance.getPositionInRoute(s + this._moveOffset, !0);
            o.setPosition(h.x, h.y, h.z);
            let u = lt.Instance.getPositionInRoute(s + this._moveOffset + .1, !0);
            o.lookAt(u.x, u.y, u.z)
          }
        }
    }
    destroy() {
      this.clearPath(), this.routeArrow.destroy(), this.routeArrow = null, this.pathObjects.destroy(), this.pathRoot.destroy()
    }
  }
  const Xi = "routeArrow";
  class Us extends He {
    init(e, s, o) {
      this.app = e, this.pc = s, this._drawPathLength = o.drawPathLength == -1 ? Number.MAX_VALUE : o.drawPathLength, this._arrowDistance = o.arrowDistance, this.pathRoot = new this.pc.Entity("pathRoot", e), this.app.root.children[0].addChild(this.pathRoot), this.pathObjects = new Ge, this.pathObjects.init(e, s, o, this.pathRoot)
    }
    setModels(e) {
      this.clearPath(), e.routeArrow ? (this.routeArrow = e.routeArrow, this.routeArrow.name = Xi, vt.Instance.register(this.routeArrow, 50)) : vt.Instance.register(new this.pc.Entity(Xi), 50), this.pathObjects.setModels(e)
    }
    clearPath() {
      if (this.pathObjects.clearPath(), this._dtsArrowMap) {
        for (let e of this._dtsArrowMap) e[1] != null && vt.Instance.destroy(e[1]);
        this._dtsArrowMap.clear(), this._dtsArrowMap = null
      }
    }
    drawPath(e) {
      this.pathObjects.drawPath(e);
      const s = e.distanceFromStart;
      if (!this._dtsArrowMap || this._dtsArrowMap.size <= 0) {
        this._dtsArrowMap = new Map;
        let u = lt.Instance.routeLength,
          p = 0;
        for (; p <= u;) this._dtsArrowMap.set(p, null), p += this._arrowDistance
      }
      let o = s - 1 >= 0 ? s - 1 : 0,
        h = s + this._drawPathLength >= lt.Instance.currentPlanBreakFromStart ? lt.Instance.currentPlanBreakFromStart : s + this._drawPathLength;
      for (let u of this._dtsArrowMap.keys())
        if (u >= o && u <= h) {
          if (this._dtsArrowMap.get(u) == null) {
            let p = vt.Instance.create(Xi);
            p.reparent(this.pathRoot);
            let _ = lt.Instance.getPositionInRoute(u, !0);
            p.setPosition(_.x, _.y, _.z);
            let g = lt.Instance.getPositionInRoute(u + .1, !0);
            p.lookAt(g.x, g.y, g.z), this._dtsArrowMap.set(u, p)
          }
        } else this._dtsArrowMap.get(u) != null && (vt.Instance.destroy(this._dtsArrowMap.get(u)), this._dtsArrowMap.set(u, null))
    }
    onCameraUpdate(e, s) {}
    destroy() {
      this.clearPath(), this.routeArrow.destroy(), this.routeArrow = null, this.pathObjects.destroy(), this.pathRoot.destroy()
    }
  }
  const Qi = "routeArrow";
  class Ns extends He {
    init(e, s, o) {
      this.app = e, this.pc = s, this._drawPathLength = o.drawPathLength, this._arrowDistance = o.arrowDistance, this.pathRoot = new this.pc.Entity("pathRoot", e), this.app.root.children[0].addChild(this.pathRoot), this.pathObjects = new Ge, this.pathObjects.init(e, s, o, this.pathRoot)
    }
    setModels(e) {
      this.clearPath(), e.routeArrow ? (this.routeArrow = e.routeArrow, this.routeArrow.name = Qi, vt.Instance.register(this.routeArrow, 50)) : vt.Instance.register(new this.pc.Entity(Qi), 50), this.pathObjects.setModels(e)
    }
    clearPath() {
      this.pathObjects.clearPath()
    }
    drawPath(e) {
      this.pathObjects.drawPath(e);
      const s = e.distanceFromStart;
      if (!this._dtsArrowMap || this._dtsArrowMap.size <= 0) {
        this._dtsArrowMap = new Map;
        let u = lt.Instance.routeLength,
          p = 0;
        for (; p <= u;) this._dtsArrowMap.set(p, null), p += this._arrowDistance
      }
      let o = s - 1 >= 0 ? s - 1 : 0,
        h = s + this._drawPathLength >= lt.Instance.routeLength ? lt.Instance.routeLength : s + this._drawPathLength;
      for (let u of this._dtsArrowMap.keys())
        if (u >= o && u <= h) {
          if (this._dtsArrowMap.get(u) == null) {
            let p = vt.Instance.create(Qi);
            p.reparent(this.pathRoot);
            let _ = lt.Instance.getPositionInRoute(u, !0);
            p.setPosition(_.x, _.y, _.z);
            let g = lt.Instance.getPositionInRoute(u + .1, !0);
            p.lookAt(g.x, g.y, g.z), this._dtsArrowMap.set(u, p)
          }
        } else this._dtsArrowMap.get(u) != null && (vt.Instance.destroy(this._dtsArrowMap.get(u)), this._dtsArrowMap.set(u, null))
    }
    onCameraUpdate(e, s) {}
    destroy() {
      this.clearPath(), this.routeArrow.destroy(), this.routeArrow = null, this.pathObjects.destroy(), this.pathRoot.destroy()
    }
  }
  class rr {
    constructor() {
      this._callbacks = {}, this._callbackActive = {}
    }
    initEventHandler() {
      this._callbacks = {}, this._callbackActive = {}
    }
    _addCallback(e, s, o, h = !1) {
      !e || typeof e != "string" || !s || (this._callbacks[e] || (this._callbacks[e] = []), this._callbackActive[e] && this._callbackActive[e] === this._callbacks[e] && (this._callbackActive[e] = this._callbackActive[e].slice()), this._callbacks[e].push({
        callback: s,
        scope: o || this,
        once: h
      }))
    }
    on(e, s, o) {
      return this._addCallback(e, s, o, !1), this
    }
    off(e, s, o) {
      if (e) this._callbackActive[e] && this._callbackActive[e] === this._callbacks[e] && (this._callbackActive[e] = this._callbackActive[e].slice());
      else
        for (const h in this._callbackActive) this._callbacks[h] && this._callbacks[h] === this._callbackActive[h] && (this._callbackActive[h] = this._callbackActive[h].slice());
      if (!e) this._callbacks = {};
      else if (!s) this._callbacks[e] && (this._callbacks[e] = []);
      else {
        const h = this._callbacks[e];
        if (!h) return this;
        let u = h.length;
        for (let p = 0; p < u; p++) h[p].callback === s && (o && h[p].scope !== o || (h[p--] = h[--u]));
        h.length = u
      }
      return this
    }
    fire(e, ...s) {
      if (!e || !this._callbacks[e]) return this;
      let o;
      this._callbackActive[e] ? (this._callbackActive[e] === this._callbacks[e] && (this._callbackActive[e] = this._callbackActive[e].slice()), o = this._callbacks[e].slice()) : this._callbackActive[e] = this._callbacks[e];
      for (let h = 0;
        (o || this._callbackActive[e]) && h < (o || this._callbackActive[e]).length; h++) {
        const u = (o || this._callbackActive[e])[h];
        if (u.callback.call(u.scope, ...s), u.once) {
          const p = this._callbacks[e],
            _ = p ? p.indexOf(u) : -1;
          _ !== -1 && (this._callbackActive[e] === p && (this._callbackActive[e] = this._callbackActive[e].slice()), this._callbacks[e].splice(_, 1))
        }
      }
      return o || (this._callbackActive[e] = null), this
    }
    once(e, s, o) {
      return this._addCallback(e, s, o, !0), this
    }
    hasEvent(e) {
      return this._callbacks[e] && this._callbacks[e].length !== 0 || !1
    }
  }

  function Ji(a) {
    return a && typeof a.x == "number" && typeof a.y == "number" && typeof a.z == "number"
  }

  function qs(a) {
    return a && a.length > 0 && Ji(a[0])
  }

  function nr(a, e, s) {
    var o, h, u, p, _, g;
    const k = Pt.Instance;
    zs(s);
    const E = new Vs(e);
    E.initialize(), vt.Instance.init(a, e), s.id && (E.id = s.id), s.routeWidth && (E.routeWidth = s.routeWidth, lt.Instance.routeWidth = s.routeWidth), s.requestRoute && (E.requestRoute = s.requestRoute), s.arriveRadious && (E.arriveRadious = s.arriveRadious), s.drawPathLength && (E.drawPathLength = s.drawPathLength);
    let D = [];
    if (s.pathSetting && !s.pathSetting.disable) {
      const B = s.pathSetting;
      switch (E.pathType = B.pathType, B.pathType) {
        case Ae.StaticArrow:
          E.path = new Fs;
          break;
        case Ae.AverageArrowPath:
          E.path = new Us;
          break;
        case Ae.MeshPlane:
          E.path = new Ns;
          break;
        case Ae.MoveArrow:
          E.path = new Os;
          break;
        case Ae.None:
          E.path = new Bs;
          break
      }
      if (E.path) {
        let O = {
          drawPathLength: s.drawPathLength,
          arrowDistance: B.arrowDistance,
          moveSpeed: B.moveSpeed
        };
        E.path.init(e, a, O)
      }
    }
    if (s.flowArrowSetting && !s.flowArrowSetting.disable) {
      const B = s.flowArrowSetting;
      E.flowArrow = new Ds, E.flowArrow.init(a, e, E.cameraEntity, B.offsetCamera, B.lookDistance)
    }
    if (s.navigator && !s.navigator.disable) {
      const B = s.navigator;
      E.navigator = new Ls(E), E.navigator.init(e, a, B);
      let O = k.getPlugin("AssistantPlugin");
      if (O) {
        let H = new Promise(Q => {
          let it = setInterval(() => {
            O.isReady && (clearInterval(it), E.navigator.setAssistantPlugin(O), Q(null))
          }, 10)
        });
        D.push(H)
      } else if (((h = (o = s.modelTinyApp) == null ? void 0 : o.navigatorModel) == null ? void 0 : h.length) > 0) {
        let H = new Promise(Q => {
          var it;
          let V = new Ss((it = s.modelTinyApp) == null ? void 0 : it.navigatorModel);
          k.addPlugin(V), V.onReady = () => {
            V.sdsAssistant.setController(E), E.navigator && E.navigator.setAssistantPlugin(V), Q(null)
          }
        });
        D.push(H)
      }
    }
    if (((p = (u = s.modelTinyApp) == null ? void 0 : u.routeModels) == null ? void 0 : p.length) > 0 && (E.path || E.flowArrow)) {
      let B = new Promise((O, H) => {
        try {
          let Q = k.instantiateTinyRoot({
            type: $t.TinyAPP,
            name: "navModels",
            tinyAppUrl: s.modelTinyApp.routeModels,
            loadCondition: Lt.auto,
            showCondition: Lt.manual
          });
          Q.on("loaded", () => {
            console.log("3d:navModels loaded");
            let it = {
              routeArrow: null,
              endModel: null,
              elevatorModel: null,
              downStairModel: null,
              upStairModel: null,
              flolowArrow: null,
              turnLeftModel: null,
              turnRightModel: null
            };
            Q.rootEntity.children[0].children.forEach(V => {
              V.name == "_route" ? it.routeArrow = V : V.name == "_end" ? it.endModel = V : V.name == "_elevator" ? it.elevatorModel = V : V.name == "_downStair" ? it.downStairModel = V : V.name == "_upStair" ? it.upStairModel = V : V.name == "_follow" ? it.flolowArrow = V : V.name == "_left" ? it.turnLeftModel = V : V.name == "_right" && (it.turnRightModel = V)
            }), E.setModels(it), O(null)
          })
        } catch (Q) {
          H(Q)
        }
      }).catch(() => {
        console.error("3d:navModels load error"), E.setModels({})
      });
      E.baseAssetLoadPromise = B, D.push(B)
    } else E.baseAssetLoadPromise = Promise.resolve(), D.push(E.baseAssetLoadPromise);
    if (((g = (_ = s.modelTinyApp) == null ? void 0 : _.targetFinderModel) == null ? void 0 : g.length) > 0) {
      let B = k.instantiateTinyRoot({
          type: $t.TinyAPP,
          name: "targetFinder",
          tinyAppUrl: s.modelTinyApp.targetFinderModel,
          loadCondition: Lt.auto,
          showCondition: Lt.auto
        }),
        O = new Promise(H => {
          B.on("loaded", () => {
            H(null)
          })
        });
      D.push(O)
    }
    return E.allAssetLoadPromise = Promise.all(D), E
  }
  class Vs extends rr {
    constructor(e) {
      super(), this.id = "default", this.pathType = Ae.StaticArrow, this.routeWidth = 3, this.arriveRadious = 3, this.messageInterval = 1, this.drawPathLength = 50, this.maxTryRegetRouteCount = 3, this.deviateRegetTime = 2, this.isVRNav = !1, this._target = null, this._realTarget = null, this._naving = !1, this._endPos = null, this._messageTimer = 0, this._tryRegetRouteCount = 0, this._deviateTimer = 0, this.app = e, this.app.on("update", this.update, this)
    }
    initialize() {
      this.cameraEntity = this.app.root.findByTag("MainCamera")[0], this.cameraEntity || (this.cameraEntity = this.app.root.findByName("Camera")), this.on("nav_start", this.startNav, this), this.on("nav_cancel", this.cancelNav, this), this.on("nav_setConfig", this.setConfig, this), this.on("nav_setId", this.setId, this), this.on("nav_continue", this.navContinue, this), this.on("nav_call_arrive", this.navArrive, this), this.on("nav_call_break", this.navBreak, this)
    }
    update(e) {
      if (this._naving) {
        this._messageTimer -= e;
        let s = lt.Instance.getRoute(this.cameraEntity.getPosition(), this.drawPathLength);
        if (s) {
          if (this.app.fire("routeRes", s), this._deviateTimer = 0, this._tryRegetRouteCount = 0, this.path && this.path.onCameraUpdate(this.cameraEntity, s.distanceFromStart), this.flowArrow && this.flowArrow.onCameraUpdate(this.cameraEntity, s.distanceFromStart), this.navigator && this.navigator.onCameraUpdate(this.cameraEntity, s.distanceFromStart), this._messageTimer <= 0) {
            this._messageTimer = this.messageInterval;
            let o = {
              target: this._realTarget,
              distanceToEnd: s.distanceToEnd,
              nextAction: s.nextAction,
              distanceToNextAction: s.distanceToNextAction,
              distanceToBreak: s.distanceToNextBreak
            };
            if (this.path && this.path.drawPath(s), this.fire("nav_message", o), s.distanceToEnd < this.arriveRadious && !this.isVRNav) {
              this.navArrive();
              return
            }(s.distanceToNextBreak < this.arriveRadious || s.inBreak) && (this.isVRNav || this.navBreak())
          }
        } else this._deviateTimer += e, this._deviateTimer >= this.deviateRegetTime && (console.warn("3d:\u504F\u79BB\u8DEF\u7EBF\uFF0C\u91CD\u65B0\u8BA1\u7B97"), this.fire("nav_deviate"), this._naving = !1, this.navigator && this.navigator.reset(), this.path && this.path.clearPath(), this.regetRoutePlan())
      }
    }
    destroy() {
      this.allAssetLoadPromise = null, this.baseAssetLoadPromise = null, this.app.off("update", this.update, this), this.off("nav_start", this.startNav, this), this.off("nav_cancel", this.cancelNav, this), this.off("nav_setConfig", this.setConfig, this), this.off("nav_setId", this.setId, this), this.off("nav_continue", this.navContinue, this), this.off("nav_call_arrive", this.navArrive, this), this.off("nav_call_break", this.navBreak, this), this.flowArrow && this.flowArrow.detroy(), this.path && this.path.destroy(), this.navigator && this.navigator.destroy(), vt.Instance.destroyPool(), this.off()
    }
    setModels(e) {
      this.path && this.path.setModels(e), this.flowArrow && this.flowArrow.setModel(e.flolowArrow)
    }
    startNav(e) {
      this._naving && this.cancelNav(), this._target = e, Array.isArray(this._target) ? qs(this._target) ? this._endPos = this._target : this._endPos = this._target.map(s => s.position) : Ji(this._target) ? this._endPos = this._target : this._endPos = this._target.position, this.getRoutePlan().then(s => {
        if (!s) return;
        this._rawRoute = s.route, lt.Instance.setRoutePlane(s.start, s.route, s.end), this._messageTimer = 0, this._deviateTimer = 0, this._naving = !0;
        let o = {
          target: this._realTarget,
          distanceToEnd: lt.Instance.matkers[0].distanceToEnd,
          nextAction: lt.Instance.matkers[0].getNextAction().action,
          distanceToNextAction: lt.Instance.matkers[0].getNextAction().distance,
          distanceToBreak: lt.Instance.matkers[0].distanceToNextBreak
        };
        this.fire("nav_message", o), this.fire("route_ready", lt.Instance.matkers, lt.Instance.navPlanManager.plans), this._tryRegetRouteCount = 0
      })
    }
    cancelNav() {
      this._naving = !1, console.log("3d:nav_calcel", this._target), this._target = null, this.path && this.path.clearPath(), this.flowArrow && this.flowArrow.hide(), this.navigator && this.navigator.over(), lt.Instance.clear(), this.off("enter_trigger", this.onEnterTargetTirgger, this)
    }
    navArrive() {
      this._naving = !1;
      let e = {
        target: this._target,
        endAction: lt.Instance.getMarker(lt.Instance.markerCount - 1).action
      };
      this._target = null, this.path && this.path.clearPath(), this.flowArrow && this.flowArrow.hide(), this.navigator && this.navigator.over(), lt.Instance.clear(), this.off("enter_trigger", this.onEnterTargetTirgger, this), this.fire("nav_arrive", this._realTarget, e.endAction), console.log("3d:nav_arrive", e)
    }
    navBreak() {
      let e = lt.Instance.getBrekInfo();
      e && (this._naving = !1, this.path && this.path.clearPath(), this.flowArrow && this.flowArrow.hide(), this.navigator && this.navigator.reset(), this.fire("nav_break", e))
    }
    async getRoutePlan() {
      let e = this.cameraEntity.getPosition();
      console.log("3d:quireRoute", JSON.stringify({
        id: this.id,
        start: {
          x: e.x,
          y: e.y,
          z: e.z
        },
        end: this._endPos
      }));
      const s = await this.requestRoute({
        alg: {
          method: "astar",
          heuristic: 1
        },
        id: this.id,
        start: {
          x: e.x,
          y: e.y,
          z: e.z
        },
        end: this._endPos
      });
      if (console.log("3d: route res:", s), s.error) return console.error(s.error), this._naving = !1, null;
      if (s.route.length <= 0) return console.error("\u8DEF\u7B97\u8FD4\u56DE\u7A7A\u8DEF\u5F84"), null;
      if (s.start = {
          x: e.x,
          y: e.y,
          z: e.z
        }, Ji(this._endPos)) s.end = this._endPos, this._realTarget = this._target;
      else if (qs(this._endPos)) {
        let o = null,
          h = 0,
          u = Number.MAX_VALUE,
          p = s.route[s.route.length - 1].position;
        this._endPos.forEach((_, g) => {
          let k = new tt(p.x, p.y, p.z).distance(new tt(_.x, _.y, _.z));
          k < u && (u = k, o = _, h = g)
        }), s.end = o, this._realTarget = this._target[h]
      } else s.end = null;
      return s
    }
    regetRoutePlan() {
      this._tryRegetRouteCount++, this._tryRegetRouteCount <= this.maxTryRegetRouteCount ? this.getRoutePlan().then(e => {
        if (!e) return;
        let s = e.route,
          o = Math.min(s.length, this._rawRoute.length);
        for (let u = 1; u <= o; u++)
          if (this._rawRoute[this._rawRoute.length - u].id != s[s.length - u].id) {
            this.fire("nav_resetRoute"), console.log("3d:nav_resetRoute");
            break
          } this._rawRoute = s, lt.Instance.setRoutePlane(e.start, e.route, e.end), this._messageTimer = 0, this._deviateTimer = 0, this._naving = !0;
        let h = {
          target: this._realTarget,
          distanceToEnd: lt.Instance.matkers[0].distanceToEnd,
          nextAction: lt.Instance.matkers[0].getNextAction().action,
          distanceToNextAction: lt.Instance.matkers[0].getNextAction().distance,
          distanceToBreak: lt.Instance.matkers[0].distanceToNextBreak
        };
        this.fire("nav_message", h), this.fire("route_ready", lt.Instance.matkers)
      }) : (console.warn("\u591A\u6B21\u91CD\u590D\u504F\u79BB\u8DEF\u7EBF,\u505C\u6B62\u8BF7\u6C42"), this.cancelNav(), this.fire("nav_maxRetryCount"))
    }
    onEnterTargetTirgger(e) {}
    setConfig(e) {
      e.id && (this.id = e.id), e.requestRoute && (this.requestRoute = e.requestRoute)
    }
    setId(e) {
      this.id = e
    }
    navContinue() {
      this._naving || (lt.Instance.setNextRoutePlan(), this._naving = !0)
    }
  }
  console.log("use ar-nav-system-pc v4.1.3"), rt.$GetTinyRoot = Za, rt.$TinyLoader = tr, rt.$TinyLuncher = er, rt.APath = He, rt.ARManager = fi.exports.ARManager, rt.AssistantPlugin = Ss, rt.AverageArrowPath = Us, rt.BlockController = Ya, rt.CanvasFontPlugin = Ja, rt.EmaTinyRoot = zi, rt.Floor = Ui, rt.FlowArrow = Ds, rt.LoadCondition = Lt, rt.LocationManager = yi, rt.Mat3 = Ni, rt.Mat4 = Gt, rt.MeshPlanePath = Ns, rt.MoveArrowPath = Os, rt.NavManager = Vs, rt.NavPlanManager = Is, rt.Navigator = Ls, rt.NoneArrowPath = Bs, rt.PathType = Ae, rt.PlanItem = Ps, rt.Quat = qi, rt.RouteManager = lt, rt.RouteSignObjects = Ge, rt.SceneMarker = ee, rt.StaticArrowPath = Fs, rt.TinyARPlugin = fi.exports.TinyARPlugin, rt.TinyAppTinyRoot = mi, rt.TinyLoader = Ht, rt.TinyLuncher = Pt, rt.TinyRoot = Le, rt.TinyRootType = $t, rt.Vec2 = he, rt.Vec3 = tt, rt.Vec4 = vi, rt.VideoManagerPlugin = Ts, rt.WxVideoDecoder = Rs, rt.getMyRoot = ke, rt.initNavSystem = nr, rt.initScripts = Bi, rt.loadProject = ja, rt.markerTag = oe, rt.math = Zt, rt.routeAction = xt, rt.vkTinyPlugin = Qa, Object.defineProperties(rt, {
    __esModule: {
      value: !0
    },
    [Symbol.toStringTag]: {
      value: "Module"
    }
  })
});