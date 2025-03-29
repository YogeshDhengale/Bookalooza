(function (global) {
	'use strict';

	var fabric = global.fabric || (global.fabric = {}),
		min = Math.min,
		max = Math.max,
		util = fabric.util,
		degreesToRadians = util.degreesToRadians,
		removeFromArray = util.removeFromArray,
		qrDecompose = util.qrDecompose,
		multiplyMatrices = util.multiplyTransformMatrices,
		transformPoint = util.transformPoint,
		invertTransform = util.invertTransform;
	util.addPrototypeProps(fabric.Object, {
		emitClip: true,
		getSuperParentLayer: function () {
			var currLayer = this.layer, layer = currLayer;
			while (currLayer) {
				currLayer = currLayer.layer;
				if (currLayer)
					layer = currLayer;
			}
			return layer;
		},
		getParentLayer: function () {
			return this.layer;
		},
		getParent: function () {
			return this.layer || this.canvas;
		},
		getAngle: function () {
			return this.angle;
		},
		isOnScreen: function (calculate) {
			if (this.previewCanvas)
				return true;

			if (!this.canvas) {
				return false;
			}

			var pointTL = this.canvas.vptCoords.tl, pointBR = this.canvas.vptCoords.br,
				points = this.getCoords(true, calculate),
				layer = this.getParentLayer();
			if (layer) {
				return true;
			}
			if (points.some(function (point) {
				return point.x <= pointBR.x && point.x >= pointTL.x &&
					point.y <= pointBR.y && point.y >= pointTL.y;
			})) {
				return true;
			}
			if (this.intersectsWithRect(pointTL, pointBR, true, calculate)) {
				return true;
			}
			return this._containsCenterOfCanvas(pointTL, pointBR, calculate);
		},
		getViewportTransform: function (skipLayer) {
			if (this.canvas && this.canvas.viewportTransform) {
				return this.calcLayerMatrix().value;
			}
			return fabric.iMatrix.concat();
		},
		transformMatrixKey: function (skipGroup) {
			var sep = '_', prefix = '';
			if (!skipGroup && this.group) {
				prefix = this.group.transformMatrixKey(skipGroup) + sep;
			} else if (this.canvas) {
				var vpt = this.canvas.viewportTransform;
				if (vpt) {
					prefix += JSON.stringify(vpt);
				}
			}
			return prefix + this.top + sep + this.left + sep + this.scaleX + sep + this.scaleY +
				sep + this.skewX + sep + this.skewY + sep + this.angle + sep + this.originX + sep + this.originY +
				sep + this.width + sep + this.height + sep + this.strokeWidth + this.flipX + this.flipY;
		},
		calcLayerMatrix: function () {
			var key = this.transformMatrixKey(true), cache = this.layerMatrixCache || (this.layerMatrixCache = {});
			if (cache.key === key) {
				return cache;
			}
			var layer = this.getParentLayer(),
				options;
			if (layer) {
				options = {
					angle: layer.angle,
					translateX: layer.left,
					translateY: layer.top,
					scaleX: layer.scaleX,
					scaleY: layer.scaleY,
					skewX: layer.skewX,
					skewY: layer.skewY,
					flipX: layer.flipX,
					flipY: layer.flipY,
				};
				var m = util.composeMatrix(options);
				cache.value = multiplyMatrices(this.canvas.viewportTransform, m);
				//m[4] = 0; m[5] = 0;
				cache.poinerMatrix = invertTransform(m);
			} else {
				cache.poinerMatrix = [1, 0, 0, 1, 0, 0];
				cache.value = this.canvas.viewportTransform.slice(0);
			}
			cache.key = key;

			return cache;
		},
		_calculateCurrentDimensions: function () {
			var opt = qrDecompose(this.getViewportTransform()),
				dim = this._getTransformedDimensions(),
				p = new fabric.Point(dim.x * opt.scaleX, dim.y * opt.scaleY);
			return p.scalarAdd(2 * this.padding);
		},
		_renderControls: function (ctx, styleOverride) {
			var vpt = this.getViewportTransform(),
				matrix = this.calcTransformMatrix(),
				options, drawBorders, drawControls;
			styleOverride = styleOverride || {};
			drawBorders = typeof styleOverride.hasBorders !== 'undefined' ? styleOverride.hasBorders : this.hasBorders;
			drawControls = typeof styleOverride.hasControls !== 'undefined' ? styleOverride.hasControls : this.hasControls;
			matrix = multiplyMatrices(vpt, matrix);
			options = qrDecompose(matrix);
			ctx.save();
			ctx.translate(options.translateX, options.translateY);
			ctx.lineWidth = 1 * this.borderScaleFactor;
			if (!this.group) {
				ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
			}
			if (styleOverride.forActiveSelection) {
				ctx.rotate(degreesToRadians(options.angle));
				drawBorders && this.drawBordersInGroup(ctx, options, styleOverride);
			}
			else {
				var layer = this.getParentLayer();
				ctx.rotate(degreesToRadians(layer ? options.angle : this.angle));
				drawBorders && this.drawBorders(ctx, styleOverride);
			}
			drawControls && this.drawControls(ctx, styleOverride);
			ctx.restore();
		},
		calcOCoords: function () {
			var rotateMatrix = this._calcRotateMatrix(),
				translateMatrix = this._calcTranslateMatrix(),
				vpt = this.getViewportTransform(),
				startMatrix = multiplyMatrices(vpt, translateMatrix),
				finalMatrix = multiplyMatrices(startMatrix, rotateMatrix),
				dim = this._calculateCurrentDimensions(),
				coords = {},
				opt = qrDecompose(vpt);
			finalMatrix = multiplyMatrices(finalMatrix, [1 / opt.scaleX, 0, 0, 1 / opt.scaleY, 0, 0]);
			this.forEachControl(function (control, key, fabricObject) {
				coords[key] = control.positionHandler(dim, finalMatrix, fabricObject);
			});
			return coords;
		},
		getTotalObjectScaling: function () {
			var scale = this.getObjectScaling(), scaleX = scale.scaleX, scaleY = scale.scaleY;
			if (this.canvas) {
				var retina = this.canvas.getRetinaScaling();
				var zoom = this.canvas.getZoom();
				scaleX *= zoom * retina;
				scaleY *= zoom * retina;
				if (this.layer) {
					scaleX *= this.layer.scaleX;
					scaleY *= this.layer.scaleY;
				}
			}
			return { scaleX: scaleX, scaleY: scaleY };
		},
		_updateCacheCanvas: function () {
			var targetCanvas = this.canvas;
			if (!this.layer && this.noScaleCache && targetCanvas && targetCanvas._currentTransform) {
				var target = targetCanvas._currentTransform.target,
					action = targetCanvas._currentTransform.action;
				if (this === target && action.slice && (action === 'rotate' || action.slice(0, 5) === 'scale')) {
					return false;
				}
			}
			var canvas = this._cacheCanvas,
				dims = this._limitCacheSize(this._getCacheCanvasDimensions()),
				minCacheSize = fabric.minCacheSideLimit,
				width = dims.width, height = dims.height, drawingWidth, drawingHeight,
				zoomX = dims.zoomX, zoomY = dims.zoomY,
				dimensionsChanged = width !== this.cacheWidth || height !== this.cacheHeight,
				zoomChanged = this.zoomX !== zoomX || this.zoomY !== zoomY,
				shouldRedraw = dimensionsChanged || zoomChanged,
				additionalWidth = 0, additionalHeight = 0, shouldResizeCanvas = false;
			if (dimensionsChanged) {
				var canvasWidth = this._cacheCanvas.width,
					canvasHeight = this._cacheCanvas.height,
					sizeGrowing = width > canvasWidth || height > canvasHeight,
					sizeShrinking = (width < canvasWidth * 0.9 || height < canvasHeight * 0.9) && canvasWidth > minCacheSize && canvasHeight > minCacheSize;
				shouldResizeCanvas = sizeGrowing || sizeShrinking;
				if (sizeGrowing && !dims.capped && (width > minCacheSize || height > minCacheSize)) {
					additionalWidth = width * 0.1;
					additionalHeight = height * 0.1;
				}
			}
			if (shouldRedraw) {
				if (shouldResizeCanvas) {
					canvas.width = Math.ceil(width + additionalWidth);
					canvas.height = Math.ceil(height + additionalHeight);
				} else {
					this._cacheContext.setTransform(1, 0, 0, 1, 0, 0);
					this._cacheContext.clearRect(0, 0, canvas.width, canvas.height);
				}
				drawingWidth = dims.x / 2;
				drawingHeight = dims.y / 2;
				this.cacheTranslationX = Math.round(canvas.width / 2 - drawingWidth) + drawingWidth;
				this.cacheTranslationY = Math.round(canvas.height / 2 - drawingHeight) + drawingHeight;
				this.cacheWidth = width;
				this.cacheHeight = height;
				this._cacheContext.translate(this.cacheTranslationX, this.cacheTranslationY);
				this._cacheContext.scale(zoomX, zoomY);
				this.zoomX = zoomX;
				this.zoomY = zoomY;
				return true;
			}
			return false;
		},
		isLayer: function () {
			return false;
		},
		getSvgCommons: function () {
			return [
				this.id ? 'id="' + this.id + '" ' : '',
				this.emitClip && this.clipPath && this.clipPath.clipPathId ? 'clip-path="url(#' + this.clipPath.clipPathId + ')" ' : '',
			].join('');
		},
		_createBaseSVGMarkup: function (objectMarkup, options) {
			options = options || {};
			var noStyle = options.noStyle,
				reviver = options.reviver,
				styleInfo = noStyle ? '' : 'style="' + this.getSvgStyles() + '" ',
				shadowInfo = options.withShadow ? 'style="' + this.getSvgFilter() + '" ' : '',
				clipPath = this.emitClip && this.clipPath,
				vectorEffect = this.strokeUniform ? 'vector-effect="non-scaling-stroke" ' : '',
				absoluteClipPath = clipPath && clipPath.absolutePositioned,
				stroke = this.stroke, fill = this.fill, shadow = this.shadow,
				commonPieces, markup = [], clipPathMarkup,
				index = objectMarkup.indexOf('COMMON_PARTS'),
				additionalTransform = options.additionalTransform;
			if (clipPath) {
				clipPath.clipPathId = 'CLIPPATH_' + fabric.Object.__uid++;
				clipPathMarkup = '<clipPath id="' + clipPath.clipPathId + '" >\n' +
					clipPath.toClipPathSVG(reviver) +
					'</clipPath>\n';
			}
			if (absoluteClipPath) {
				markup.push(
					'<g ', shadowInfo, this.getSvgCommons(), ' >\n'
				);
			}
			markup.push(
				'<g ',
				this.getSvgTransform(false),
				!absoluteClipPath ? shadowInfo + this.getSvgCommons() : '',
				' >\n'
			);
			if (fill && fill.toLive) {
				markup.push(fill.toSVG(this));
			}
			if (stroke && stroke.toLive) {
				markup.push(stroke.toSVG(this));
			}
			if (shadow) {
				markup.push(shadow.toSVG(this));
			}
			if (clipPath) {
				markup.push(clipPathMarkup);
			}

			if (this.emitExtraStroke) {
				var extraStrokes = this.getExtraStrokes();
				if (extraStrokes) {
					for (var i = 0, len = extraStrokes.length; i < len; ++i) {
						if (objectMarkup[index] = this.emitExtraStroke(extraStrokes[i]))
							markup.push(objectMarkup.join(''));
					}
				}
			}

			commonPieces = [
				styleInfo,
				vectorEffect,
				noStyle ? '' : this.addPaintOrder(),
				additionalTransform ? ' transform="' + additionalTransform + '" ' : '',
			];
			objectMarkup[index] = this.emitNormal(commonPieces);
			markup.push(objectMarkup.join(''));

			markup.push('</g>\n');
			absoluteClipPath && markup.push('</g>\n');
			return reviver ? reviver(markup.join('')) : markup.join('');
		},
		getExtraStrokes: function () {
			var extraStrokes = this.extraStrokes;
			if (!extraStrokes)
				return [];
			var strokeWidth = this.strokeWidth / 2,
				me = this;
			extraStrokes = extraStrokes.map(function (dec, idx) {
				dec = JSON.parse(JSON.stringify(dec));
				dec.strokeWidth = dec.strokeWidth || me.strokeWidth;
				dec.strokeWidth += strokeWidth;
				strokeWidth = dec.strokeWidth;
				dec.strokeWidth *= 2;
				return dec;
			});
			return extraStrokes.reverse();
		},
		emitNormal: function (common) {
			return common.join('');
		},
		isExcludeFromExport: function () {
			return this.excludeFromExport;
		}
	});

	fabric.util.clipContext = function (receiver, ctx) {
		ctx.save();
		ctx.beginPath();
		receiver.clipTo(ctx);
		ctx.clip();
	};

	fabric.util.getSvgColorString = function (prop, value) {
		if (!value) {
			return prop + ': none; ';
		} else if (value.toLive) {
			return prop + ': url(#SVGID_' + value.id + '); ';
		} else {
			var color = new fabric.Color(value),
				str = prop + ': ' + color.toRgb() + '; ',
				opacity = color.getAlpha();
			if (opacity !== 1) {
				str += prop + '-opacity: ' + opacity.toString() + '; ';
			}
			return str;
		}
	}

	fabric.util.addPrototypeProps(fabric.StaticCanvas, {
		renderCanvas: function (ctx, objects) {
			var v = this.viewportTransform, path = this.clipPath;
			this.cancelRequestedRender();
			this.calcViewportBoundaries();
			this.clearContext(ctx);
			fabric.util.setImageSmoothing(ctx, this.imageSmoothingEnabled);
			this.fire('before:render', { ctx: ctx, });
			this._renderBackground(ctx);

			if (this.renderCustomBackground) {
				this.renderCustomBackground(ctx);
			}
			if (this.clipTo) {
				fabric.util.clipContext(this, ctx);
			}

			ctx.save();
			//apply viewport transform once for all rendering process
			ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
			this._renderObjects(ctx, objects);
			ctx.restore();
			if (!this.controlsAboveOverlay && this.interactive) {
				this.drawControls(ctx);
			}
			if (this.clipTo) {
				ctx.restore();
			}
			if (path) {
				path.canvas = this;
				// needed to setup a couple of variables
				path.shouldCache();
				path._transformDone = true;
				path.renderCache({ forClipping: true });
				this.drawClipPathOnCanvas(ctx);
			}
			this._renderOverlay(ctx);
			if (this.renderCustomOverlay) {
				this.renderCustomOverlay(ctx);
			}
			if (this.controlsAboveOverlay && this.interactive) {
				this.drawControls(ctx);
			}
			this.fire('after:render', { ctx: ctx, });
		},
		sendBackwards: function (object) {
			if (!object) {
				return this;
			}
			var activeSelection = this._activeObject,
				i, obj, idx, newIdx, objs,
				lowestIndex = this.lowestFgObjectIndex || 0;

			if (object === activeSelection && object.type === 'activeSelection') {
				objs = activeSelection._objects;
				if (this.getLowestObjectIndex) {
					lowestIndex = this.getLowestObjectIndex(objs[0]);
				}
				for (i = 0; i < objs.length; i++) {
					obj = objs[i];
					idx = this._objects.indexOf(obj);
					newIdx = idx;
					if (idx !== lowestIndex) {
						newIdx = idx - 1;
						removeFromArray(this._objects, obj);
						this._objects.splice(newIdx, 0, obj);
					}
					lowestIndex = newIdx + 1; // can't go under the previous selected object
				}
			}
			else {
				idx = this._objects.indexOf(object);
				if (this.getLowestObjectIndex) {
					lowestIndex = this.getLowestObjectIndex(object);
				}
				if (idx !== lowestIndex) {
					// if object is not on the bottom of stack
					newIdx = idx - 1;
					removeFromArray(this._objects, object);
					this._objects.splice(newIdx, 0, object);
				}
			}
			this.renderOnAddRemove && this.requestRenderAll();
			return this;
		},
		sendToBack: function (object) {
			if (!object) {
				return this;
			}
			var activeSelection = this._activeObject,
				i, obj, objs,
				lowestIndex = this.lowestFgObjectIndex || 0;
			if (object === activeSelection && object.type === 'activeSelection') {
				objs = activeSelection._objects;
				for (i = objs.length; i--;) {
					obj = objs[i];
					removeFromArray(this._objects, obj);
					if (this.getLowestObjectIndex) {
						lowestIndex = this.getLowestObjectIndex(obj);
					}
					this._objects.splice(lowestIndex, 0, obj);
				}
			}
			else {
				removeFromArray(this._objects, object);
				if (this.getLowestObjectIndex) {
					lowestIndex = this.getLowestObjectIndex(object);
				}
				this._objects.splice(lowestIndex, 0, object);
			}
			this.renderOnAddRemove && this.requestRenderAll();
			return this;
		},
		_setSVGObjects: function (markup, reviver) {
			var instance, i, len, objects = this._objects;
			for (i = 0, len = objects.length; i < len; i++) {
				instance = objects[i];
				if (instance.isExcludeFromExport()) {
					continue;
				}
				this._setSVGObject(markup, instance, reviver);
			}
		},
		closeSVGEditing: function () {
			let layeringTarget = this.layeringTarget;
			if (layeringTarget) {
				this.setSvgEditing(layeringTarget, false);
			}
		}
	});

	var locks = ['lockRotation', 'lockScalingX', 'lockScalingY', 'lockSkewingX', 'lockSkewingY', 'lockMovementX', 'lockMovementY'];
	fabric.LayeredCanvas = fabric.util.createClass(fabric.Canvas, {
		_searchPossibleTargets: function (objects, pointer) {
			return this.callSuper('_searchPossibleTargets', this.getAllObjects({ _objects: objects }), pointer);
		},
		_transformObject: function (e) {
			var pointer = this.getPointer(e),
				transform = this._currentTransform;

			transform.reset = false;
			transform.shiftKey = e.shiftKey;
			transform.altKey = e[this.centeredKey];

			this._performTransformAction(e, transform, transformPoint(pointer, transform.target.calcLayerMatrix().poinerMatrix));
			transform.actionPerformed && this.requestRenderAll();
		},
		_setupCurrentTransform: function (e, target, alreadySelected) {
			if (!target) {
				return;
			}
			var pointer = transformPoint(this.getPointer(e), target.calcLayerMatrix().poinerMatrix),
				corner = target.__corner,
				control = target.controls[corner],
				actionHandler = (alreadySelected && corner) ?
					control.getActionHandler(e, target, control) : fabric.controlsUtils.dragHandler,
				action = this._getActionFromCorner(alreadySelected, corner, e, target),
				origin = this._getOriginFromCorner(target, corner),
				altKey = e[this.centeredKey],
				transform = {
					target: target,
					action: action,
					actionHandler: actionHandler,
					corner: corner,
					scaleX: target.scaleX,
					scaleY: target.scaleY,
					skewX: target.skewX,
					skewY: target.skewY,
					offsetX: pointer.x - target.left,
					offsetY: pointer.y - target.top,
					originX: origin.x,
					originY: origin.y,
					ex: pointer.x,
					ey: pointer.y,
					lastX: pointer.x,
					lastY: pointer.y,
					theta: degreesToRadians(target.angle),
					width: target.width * target.scaleX,
					shiftKey: e.shiftKey,
					altKey: altKey,
					original: fabric.util.saveObjectTransform(target)
				};

			if (this._shouldCenterTransform(target, action, altKey)) {
				transform.originX = 'center';
				transform.originY = 'center';
			}
			transform.original.originX = origin.x;
			transform.original.originY = origin.y;
			this._currentTransform = transform;
			this._beforeTransform(e);
		},
		getAllPossibleTargets: function (objects, pointer, targets) {
			var target, i = objects.length;
			if (!targets)
				targets = [];
			while (i--) {
				var objToCheck = objects[i];
				var pointerToUse = objToCheck.group ?
					this._normalizePointer(objToCheck.group, pointer) : pointer;
				if (this._checkTarget(pointerToUse, objToCheck, pointer)) {
					target = objects[i];
					if (target.subTargetCheck && target instanceof fabric.Group) {
						this._getAllPossibleTargets(target._objects, pointer, targets);
					} else {
						targets.push(target);
					}
				}
			}
			return targets;
		},
		_collectObjects: function (e) {
			var group = [],
				currentObject,
				allowSelection,
				x1 = this._groupSelector.ex,
				y1 = this._groupSelector.ey,
				x2 = x1 + this._groupSelector.left,
				y2 = y1 + this._groupSelector.top,
				selectionX1Y1 = new fabric.Point(min(x1, x2), min(y1, y2)),
				selectionX2Y2 = new fabric.Point(max(x1, x2), max(y1, y2)),
				allowIntersect = !this.selectionFullyContained,
				isClick = x1 === x2 && y1 === y2,
				allObjs = this.getAllObjects();

			for (var i = allObjs.length; i--;) {
				currentObject = allObjs[i];
				allowSelection = !currentObject.skipInnerSelection;
				if (!currentObject || !currentObject.selectable || !currentObject.visible) {
					continue;
				}
				if ((allowIntersect && currentObject.intersectsWithRect(selectionX1Y1, selectionX2Y2)) ||
					currentObject.isContainedWithinRect(selectionX1Y1, selectionX2Y2) ||
					(allowIntersect && allowSelection && currentObject.containsPoint(selectionX1Y1)) ||
					(allowIntersect && allowSelection && currentObject.containsPoint(selectionX2Y2))
				) {
					group.push(currentObject);
					if (isClick) {
						break;
					}
				}
			}

			if (group.length > 1) {
				group = group.filter(function (object) {
					return !object.onSelect({ e: e });
				});
			}

			return group;
		},
		getAllObjects: function (fromObject, arr) {
			if (!arr)
				arr = [];
			if (!fromObject)
				fromObject = this;
			fromObject = fromObject._objects;
			for (var i = 0; i < fromObject.length; ++i) {
				var obj = fromObject[i];
				if (obj.isLayer()) {
					if (obj.clipPath && obj.selectableClip)
						arr.push(obj.clipPath);
					this.getAllObjects(obj, arr);
				} else {
					arr.push(obj);
				}
			}
			return arr;
		},
		_chooseObjectsToRender: function () {
			return this.__chooseObjectsToRender(this);
		},
		getParent: function () { },
		getActiveChildrenOf: function (obj) {
			var active = this._activeObject;
			if (obj && (obj instanceof fabric.StaticCanvas || obj instanceof fabric.Layer)) {
				if (active) {
					if (obj === active.getParent()) {
						if (active.type === 'activeSelection')
							return active._objects.slice(0);
						else
							return [active];
					}
					else {
						var parent = active.getParent();
						while (parent && parent !== obj) {
							active = parent;
							parent = active.getParent();
						}
						if (parent)
							return [active];
					}
				}
			}
			return [];
		},
		__chooseObjectsToRender: function (canvas) {
			var activeChildren = canvas.getActiveChildrenOf(this),
				object, objsToRender, activeGroupObjects;
			// to fix
			var allObjs = this._objects;
			if (activeChildren.length > 0 && !canvas.preserveObjectStacking) {
				objsToRender = [];
				activeGroupObjects = [];
				for (var i = 0, length = allObjs.length; i < length; i++) {
					object = allObjs[i];
					if (activeChildren.indexOf(object) === -1) {
						objsToRender.push(object);
					}
					else {
						activeGroupObjects.push(object);
					}
				}
				objsToRender.push.apply(objsToRender, activeGroupObjects);
			}
			else {
				objsToRender = this._objects;
			}
			return objsToRender;
		},
		_discardActiveObject: function (e, object) {
			var obj = this._activeObject;
			if (obj) {
				var pLayer = obj.getParentLayer();
				while (pLayer) {
					pLayer.dirty = true;
					pLayer = pLayer.getParentLayer();
				}
				if (obj.onDeselect({ e: e, object: object })) {
					return false;
				}
				this._activeObject = null;
			}
			return true;
		},
		_groupSelectedObjects: function (e) {
			var group = this._collectObjects(e);
			if (group.length === 1) {
				this.setActiveObject(group[0], e);
			}
			else if (group.length > 1) {
				this.setActiveObject(this.getLayeredSelection(group), e);
			}
		},
		getLayeredSelection: function (group) {
			var layer = group[0].getParentLayer(),
				group1 = [],
				options = {
					canvas: this,
					layer: layer
				};
			for (var i = 0; i < group.length; ++i) {
				var obj = group[i];
				if (layer === obj.getParentLayer()) {
					group1.push(group[i]);
					locks.forEach(function (lock) {
						if (obj[lock])
							options[lock] = true;
					});
					if (!obj.hasControls)
						options.hasControls = false;
				}
			}
			return new fabric.ActiveSelection(group1.reverse(), options);
		},
		_createGroup: function (target) {
			var objects = this._objects,
				isActiveLower = objects.indexOf(this._activeObject) < objects.indexOf(target),
				groupObjects = isActiveLower ? [this._activeObject, target] : [target, this._activeObject];
			this._activeObject.isEditing && this._activeObject.exitEditing();
			return this.getLayeredSelection(groupObjects);
		},
		_updateActiveSelection: function (target, e) {
			var activeSelection = this._activeObject;
			if (activeSelection.layer !== target.getParentLayer()) {
				return;
			}
			var res = this.callSuper('_updateActiveSelection', target, e);
			locks.forEach(function (lock) {
				delete activeSelection[lock];
			});
			delete activeSelection.hasControls;
			activeSelection.getObjects().forEach(function (obj) {
				locks.forEach(function (lock) {
					if (obj[lock])
						activeSelection[lock] = true;
				});
				if (!obj.hasControls)
					activeSelection.hasControls = false;
			});
			return res;
		},
		getSubLayers: function () {
			var arr = [];
			if (this._objects)
				this._objects.forEach(function (o) {
					if (o instanceof fabric.Layer)
						arr.push(o);
				});
			return arr;
		},
		mute: function () {
			this.muteURStack = true;
		},
		unmute: function () {
			delete this.muteURStack;
		},
		objectIterator: function (ob, cb, key = "objects") {
			function iterator(obj) {
				if (cb(obj)) {
					return true;
				}
				if (!obj[key]) {
					return;
				}
				for (let o of obj[key]) {
					if (cb(o) || iterator(o)) {
						return true;
					}
				}
			}
			cb && iterator(ob);
		},
		loadFromJSON: async function (json, callback, reviver) {
			var types = new Set(['curved-text', 'text', 'textbox', 'i-text', 'textArea']),
				usedFonts = new Set(),
				fontLoader = fabric.util.fontLoader;

			var serialized = (typeof json === 'string') ? JSON.parse(json) : json;
			this.objectIterator(serialized, function (obj) {
				if (types.has(obj.type)) {
					usedFonts.add([obj.fontFamily, obj.fontStyle, obj.fontWeight].join('|@|'));
					if (obj.styles) {
						Object.values(obj.styles).reduce((prev, next) => {
							prev.push(...Object.values(next));
							return prev;
						}, []).forEach(s => {
							usedFonts.add([
								s.fontFamily || obj.fontFamily,
								s.fontStyle || obj.fontStyle,
								s.fontWeight || obj.fontWeight
							].join('|@|'));
						})
					}
				}
			});
			var usedSetFonts = new Set();
			usedFonts.forEach(font => {
				var arr = font.split('|@|');
				arr[0].split(',').forEach(f => {
					usedSetFonts.add([f, arr[1], arr[2]].join('|@|'))
				})
			});
			await fontLoader.loadFonts(Array.from(usedSetFonts).map(font => {
				var arr = font.split('|@|');
				return {
					fontFamily: arr[0],
					fontStyle: arr[1],
					fontWeight: arr[2]
				};
			}));
			return this.callSuper('loadFromJSON', json, callback, reviver);
		}
	});

	function drawImageProportionally(ctx, img, left, top, width, height) {
		var rx = width / img.width,
			ry = height / img.height;

		if (rx < ry) {
			top += (height - img.height * rx) / 2;
			height = img.height * rx;
		} else {
			left += (width - img.width * ry) / 2;
			width = img.width * ry;
		}
		ctx.drawImage(img, left - width / 2, top - height / 2, width, height);
	}

	fabric.Object.prototype.controlsSetting = {
		icon: {
			cornerSize: 24,
			cornerStrokeColor: '#CBCED0',
			cornerColor: 'white',
			cornerPadding: 10
		},
		circle: {
			cornerColor: 'white',
			cornerStrokeColor: '#CBCED0',
			cornerSize: 11
		},
		defaultControls: fabric.Object.prototype.controls,
		defaultTextboxControls: fabric.Textbox.prototype.controls
	};

	var renderCircleControl = fabric.controlsUtils.renderCircleControl;
	fabric.controlsUtils.renderCircleControl = function (ctx, left, top, styleOverride, fabricObject) {
		styleOverride.__proto__ = fabric.Object.prototype.controlsSetting.circle;
		return renderCircleControl.call(this, ctx, left, top, styleOverride, fabricObject);
	}

	fabric.controlsUtils.renderIconControl = function (ctx, left, top, icon, settings = {}) {
		settings.__proto__ = fabric.Object.prototype.controlsSetting.icon;
		var size = settings.cornerSize,
			cornerStrokeColor = settings.cornerStrokeColor,
			cornerColor = settings.cornerColor,
			cornerPadding = settings.cornerPadding;

		ctx.strokeStyle = ctx.fillStyle = cornerColor;
		ctx.strokeStyle = cornerStrokeColor;

		var fill = !this.transparentCorners;
		var stroke = !this.transparentCorners && cornerStrokeColor;
		ctx.beginPath();
		ctx.arc(left, top, size / 2, 0, 2 * Math.PI, false);
		if (fill) {
			ctx.save();
			ctx.globalAlpha = 1;
			ctx.fill();
			ctx.restore();
		}
		if (stroke) {
			ctx.stroke();
		}
		if (icon !== undefined) {
			drawImageProportionally(
				ctx, icon,
				left,
				top,
				size - cornerPadding,
				size - cornerPadding
			);
		}
	}
})(typeof exports !== 'undefined' ? exports : this);

(function (global) {

	'use strict';

	var fabric = global.fabric || (global.fabric = {}),
		multiplyMatrices = fabric.util.multiplyTransformMatrices,
		qrDecompose = fabric.util.qrDecompose,
		transformPoint = fabric.util.transformPoint;

	if (fabric.Layer) {
		return;
	}

	fabric.Layer = fabric.util.createClass(fabric.Group, {
		type: 'layer',
		renderOnAddRemove: true,
		renderClip: false,
		initialize: function (objects, options) {
			this.callSuper('initialize', objects, options, true);
			this.hasControls = false;
			var me = this;
			this._objects.forEach(function (obj) {
				delete obj.group;
				obj.layer = me;
			});
			if (options.clipPath) {
				options.clipPath.set({
					layer: me,
					isLayerClip: true,
					skipInnerSelection: true
				});
			}
		},
		_renderControls: function () {
			var args = arguments;
			this._objects.forEach(function (obj) {
				obj._renderControls.apply(obj, args);
			});
		},
		isCacheDirty: function (skipCanvas) {
			var val = this.callSuper('isCacheDirty', skipCanvas);
			if (!val && this.canvas && this.canvas._activeObject) {
				val = this.canvas._activeObject.getParentLayer() === this;
			}
			return val;
		},
		__chooseObjectsToRender: fabric.LayeredCanvas.prototype.__chooseObjectsToRender,
		_render: function () {
			var args = arguments;
			this.__chooseObjectsToRender(this.canvas).forEach(function (obj) {
				obj.render.apply(obj, args);
			});
		},
		drawObject: function (ctx) {
			var clipPath = this.clipPath;
			ctx.clearRect(-this.width, -this.height, 2 * this.width, 2 * this.height);
			ctx.save();
			ctx.translate(-this.width / 2, -this.height / 2);
			this._render(ctx);
			ctx.restore();
			this._drawClipPath(ctx);
			if (this.renderClip && clipPath) {
				ctx.save();
				var origX = -((this.width - clipPath.width) / 2 - clipPath.left),
					origY = -((this.height - clipPath.height) / 2 - clipPath.top);
				ctx.transform(1, 0, 0, 1, origX, origY);
				clipPath._render.call(clipPath, ctx);
				ctx.restore();
			}
		},
		getCanvas: function () {
			var canvas = this.canvas;
			if (!canvas)
				canvas = this.getParentLayer().canvas;
			return canvas;
		},
		_callParent: function (type, args) {
			var arr = [type];
			for (var i = 0; i < args.length; ++i)
				arr.push(args[i]);
			return this.callSuper.apply(this, arr);
		},
		add: function () {
			for (var i = 0; i < arguments.length; ++i) {
				var obj = arguments[i];
				obj.layer = this;
				obj.canvas = this.canvas;
				obj.setCoords();
			}
			return this._callParent('add', arguments);
		},
		_onObjectAdded: function () {
			this.dirty = true;
			fabric.LayeredCanvas.prototype._onObjectAdded.apply(this.canvas, arguments);
		},
		_onObjectRemoved: function () {
			this.dirty = true;
			fabric.LayeredCanvas.prototype._onObjectRemoved.apply(this.canvas, arguments);
		},
		requestRenderAll: function () {
			return this.canvas.requestRenderAll();
		},
		insertAt: function (object, index, nonSplicing) {
			object.layer = this;
			return this._callParent('insertAt', arguments);
		},
		setCoords: function () {
			this._objects.forEach(function (obj) {
				obj.setCoords();
			});
		},
		isOnScreen: function () {
			return true;
		},
		drawClipPathOnCache: function (ctx) {
			var path = this.clipPath;
			ctx.save();
			if (path.inverted) {
				ctx.globalCompositeOperation = 'destination-out';
			}
			else {
				ctx.globalCompositeOperation = 'destination-in';
			}
			ctx.scale(1 / path.zoomX, 1 / path.zoomY);
			var origX = -path.cacheTranslationX - ((this.width - path.width) / 2 - path.left) * path.zoomX,
				origY = -path.cacheTranslationY - ((this.height - path.height) / 2 - path.top) * path.zoomY;
			ctx.drawImage(path._cacheCanvas, origX, origY);
			ctx.restore();
		},
		isLayer: function () {
			return true;
		},
		bringToFront: fabric.LayeredCanvas.prototype.bringToFront,
		sendToBack: fabric.LayeredCanvas.prototype.sendToBack,
		bringForward: fabric.LayeredCanvas.prototype.bringForward,
		sendBackwards: fabric.LayeredCanvas.prototype.sendBackwards,
		_findNewLowerIndex: fabric.LayeredCanvas.prototype._findNewLowerIndex,
		_findNewUpperIndex: fabric.LayeredCanvas.prototype._findNewUpperIndex,
		getSvgTransform: function (full, additionalTransform) {
			var transform = full ? this.calcTransformMatrix() : this.calcOwnMatrix();
			transform = multiplyMatrices(transform, [1, 0, 0, 1, -this.width / 2, -this.height / 2]);
			var svgTransform = 'transform="' + fabric.util.matrixToSVG(transform);
			return svgTransform +
				(additionalTransform || '') + '" ';
		},
		getAbsolutePosition: function () {
			return {
				x: this.left || 0,
				y: this.top || 0
			};
		}
	});

	fabric.Layer.fromObject = function (object, callback) {
		var objects = object.objects,
			options = fabric.util.object.clone(object, true);
		delete options.objects;
		if (typeof objects === 'string') {
			fabric.loadSVGFromURL(objects, function (elements) {
				var group = fabric.util.groupSVGElements(elements, object, objects);
				group.set(options);
				callback && callback(group);
			});
			return;
		}

		fabric.util.enlivenObjects(objects, function (enlivenedObjects) {
			fabric.util.enlivenObjects([object.clipPath], function (enlivedClipPath) {
				var options = fabric.util.object.clone(object, true);
				options.clipPath = enlivedClipPath[0];
				delete options.objects;
				callback && callback(new fabric.Layer(enlivenedObjects, options));
			});
		});
	};
	fabric.Svg = fabric.util.createClass(fabric.Layer, {
		type: 'svg',
		renderClip: true,
		initialize: function (objects, options) {
			this.activePrototype = fabric.Group.prototype;
			fabric.Group.prototype.initialize.call(this, objects, options);
			if (!options.clipPath) {
				this.clipPath = new fabric.Rect({
					width: this.width,
					height: this.height,
					fill: '',
					stroke: '#000',
					layer: this,
					isLayerClip: true,
					skipInnerSelection: true,
					evented: false,
					selectable: false,
					left: -this.width / 2,
					top: -this.height / 2
				});
			} else {
				this.clipPath.set({
					layer: this,
					isLayerClip: true,
					skipInnerSelection: true
				});
			}
		},
		setEditable: function (val) {
			var me = this;
			if (val) {
				this.dirty = true;
				this.activePrototype = fabric.Layer.prototype;
				this.hasControls = false;
				var matrix = [1, 0, 0, 1, this.width / 2, this.height / 2];
				this._objects.forEach(function (obj) {
					fabric.util.addTransformToObject(obj, matrix);
					delete obj.group;
					obj.layer = me;
					obj.setCoords();
				});
				var vpt = multiplyMatrices(this.getViewportTransform(), this.calcOwnMatrix()),
					opt = qrDecompose(vpt),
					scale = (opt.scaleX > opt.scaleY) ? opt.scaleY : opt.scaleX;
				this.clipPath.set({
					strokeWidth: 1 / scale
				});
			} else {
				this.hasControls = true;
				this.activePrototype = fabric.Group.prototype;
				var matrix = [1, 0, 0, 1, -this.width / 2, -this.height / 2];
				this._objects.forEach(function (obj) {
					fabric.util.addTransformToObject(obj, matrix);
					delete obj.layer;
					obj.group = me;
					obj.setCoords();
				});
			}
			this.setCoords();
		},
		isEditable: function () {
			return this.activePrototype === fabric.Layer.prototype;
		},
		_renderControls: function () {
			this.activePrototype._renderControls.apply(this, arguments);
		},
		_render: function () {
			this.activePrototype._render.apply(this, arguments);
		},
		drawObject: function () {
			this.activePrototype.drawObject.apply(this, arguments);
		},
		setCoords: function () {
			this.activePrototype.setCoords.apply(this, arguments);
		},
		isCacheDirty: function () {
			return this.activePrototype.isCacheDirty.apply(this, arguments);
		},
		isLayer: function () {
			return this.activePrototype === fabric.Layer.prototype;
		},
		getSvgTransform: function () {
			return this.activePrototype.getSvgTransform.apply(this, arguments);
		},
		drawClipPathOnCache: function (ctx) {
			var path = this.clipPath;
			ctx.save();
			if (path.inverted) {
				ctx.globalCompositeOperation = 'destination-out';
			}
			else {
				ctx.globalCompositeOperation = 'destination-in';
			}
			ctx.scale(1 / path.zoomX, 1 / path.zoomY);
			var origX = -path.cacheTranslationX - (this.width - path.width) * path.zoomX / 2,
				origY = -path.cacheTranslationY - (this.height - path.height) * path.zoomY / 2,
				left = path.left + path.width / 2,
				top = path.top + path.height / 2;
			ctx.drawImage(path._cacheCanvas, origX + left * path.zoomX, origY + top * path.zoomY);
			ctx.restore();
		},
		toObject: function (propertiesToInclude) {
			var needTranslation = this.activePrototype === fabric.Layer.prototype,
				me = this;
			var _includeDefaultValues = this.includeDefaultValues,
				objsToObject = this._objects.map(function (obj) {
					var originalDefaults = obj.includeDefaultValues;
					obj.includeDefaultValues = _includeDefaultValues;
					var _obj = obj.toObject(propertiesToInclude);
					obj.includeDefaultValues = originalDefaults;
					if (needTranslation) {
						_obj.left -= me.width / 2;
						_obj.top -= me.height / 2;
					}
					return _obj;
				});
			var obj = fabric.Object.prototype.toObject.call(this, propertiesToInclude);
			obj.objects = objsToObject;
			obj.centerPoint = { x: 0, y: 0 };
			return obj;
		}
	});

	fabric.Svg.fromObject = function (object, callback) {
		var objects = object.objects,
			options = fabric.util.object.clone(object, true);
		delete options.objects;
		if (typeof objects === 'string') {
			fabric.loadSVGFromURL(objects, function (elements) {
				var group = fabric.util.groupSVGElements(elements, object, objects);
				group.set(options);
				callback && callback(group);
			});
			return;
		}
		fabric.util.enlivenObjects(objects, function (enlivenedObjects) {
			fabric.util.enlivenObjects([object.clipPath], function (enlivedClipPath) {
				var options = fabric.util.object.clone(object, true);
				options.clipPath = enlivedClipPath[0];
				delete options.objects;
				callback && callback(new fabric.Svg(enlivenedObjects, options, true));
			});
		});
	};

	fabric.util.groupSVGElements = function (elements, options, path) {
		var object;
		if (elements && elements.length === 1) {
			return elements[0];
		}
		if (options) {
			if (options.width && options.height) {
				options.centerPoint = {
					x: options.width / 2,
					y: options.height / 2
				};
			}
			else {
				delete options.width;
				delete options.height;
			}
		}
		object = new fabric.Svg(elements, options);
		if (typeof path !== 'undefined') {
			object.sourcePath = path;
		}
		return object;
	}
})(typeof exports !== 'undefined' ? exports : this);

(function (global) {
	'use strict';
	var fabric = global.fabric || (global.fabric = {}),
		extend = fabric.util.object.extend,
		filters = fabric.Image.filters,
		createClass = fabric.util.createClass;

	filters.PatternColor = createClass(filters.BaseFilter, {
		type: 'PatternColor',
		initialize: function (options) {
			options = options || {};
			this.color = options.color || '#000000';
			this.convert = options.convert;
		},
		applyTo2d: function (options) {
			var imageData = options.imageData,
				data = imageData.data, i,
				len = data.length,
				tintR, tintG, tintB,
				source = new fabric.Color(this.color).getSource();

			tintR = source[0];
			tintG = source[1];
			tintB = source[2];

			if (this.convert) {
				for (i = 0; i < len; i += 4) {
					data[i + 3] = (255 - (data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11)) * data[i + 3] / 255;
					data[i] = tintR;
					data[i + 1] = tintG;
					data[i + 2] = tintB;
				}
			} else {
				for (i = 0; i < len; i += 4) {
					data[i] = tintR;
					data[i + 1] = tintG;
					data[i + 2] = tintB;
				}
			}
		},
		toObject: function () {
			return extend(this.callSuper('toObject'), {
				color: this.color
			});
		}
	});
	fabric.Image.filters.PatternColor.fromObject = fabric.Image.filters.BaseFilter.fromObject;
})(typeof exports !== 'undefined' ? exports : this);

(function (global) {
	'use strict';
	var fabric = global.fabric,
		initialize = fabric.Pattern.prototype.initialize,
		toObject = fabric.Pattern.prototype.toObject;
	fabric.util.addPrototypeProps(fabric.Pattern, {
		type: 'pattern',
		initialize: function (options, callback) {
			var me = this;
			me.patternOptions = {};
			me.patternTransform = [1, 0, 0, 1, 0, 0];
			return initialize.call(me, options, function () {
				var psc = new fabric.Image(me.source);
				me.source = psc.getElement();
				me.fabricImage = psc;
				callback && callback.apply(me, arguments);
			});
		},
		setTransformation: function (opt, object) {
			if (!opt)
				return;
			var patternOptions = this.patternOptions;
			var patternTransform = this.patternTransform;
			for (var prop in opt)
				patternOptions[prop] = opt[prop];
			var fillScaling = this.getFillScaling(object);
			patternTransform[0] = fillScaling * patternOptions.scaleX;
			patternTransform[3] = fillScaling * patternOptions.scaleY;
			this.repeat = patternOptions.repeat;
			var scale = patternTransform[0];

			var img = typeof this.source === 'function' ? this.source() : this.source;
			patternTransform[4] = (object.width - scale * img.width) / 2 + patternOptions.translateX;
			scale = patternTransform[3];
			patternTransform[5] = (object.height - scale * img.height) / 2 + patternOptions.translateY;
		},
		toObject: function () {
			var obj = toObject.apply(this, arguments);
			obj.color = this.color;
			obj.patternOptions = this.patternOptions;
			return obj;
		},
		setImage: function (img, callback) {
			var me = this;
			delete me.fillScaling;
			if (typeof img === 'string') {
				fabric.util.loadImage(img, function (im) {
					me.fabricImage.setElement(im);
					me.source = me.fabricImage.getElement();
					callback && callback.apply(me, arguments);
				});
			} else if (img) {
				this.fabricImage.setElement(img);
				me.source = me.fabricImage.getElement();
				callback && callback.call(me, img);
			}
		},
		toSVG: function (object) {
			var patternSource = typeof this.source === 'function' ? this.source() : this.source,
				patternOptions = this.patternOptions,
				patternTransform = this.patternTransform,
				patternSourceWidth = patternSource.width,
				patternSourceHeight = patternSource.height,
				objectWidth = object.width,
				objectHeight = object.height,
				rX = objectWidth / patternSourceWidth,
				rY = objectHeight / patternSourceHeight;
			if (rX < rY) {
				rX = rY / rX;
				rY = 1;
			} else {
				rY = rX / rY;
				rX = 1;
			}
			var patternWidth = rX * patternOptions.scaleX * 100,
				patternHeight = rY * patternOptions.scaleY * 100,
				patternImgSrc = '',
				left = ((object.width - patternTransform[0] * patternSourceWidth) / 2 + patternOptions.translateX) / object.width * 100,
				top = ((object.height - patternTransform[3] * patternSourceHeight) / 2 + patternOptions.translateY) / object.height * 100,
				imageWidth = patternSourceWidth,
				imageHeight = patternSourceHeight,
				viewBoxLeft = 0,
				viewBoxTop = 0;

			switch (this.repeat) {
				case 'no-repeat':
					patternWidth = 100;
					patternHeight = 100;
					var rr = rX > rY ? rX : rY;
					imageWidth *= rr * patternOptions.scaleX;
					imageHeight *= rr * patternOptions.scaleY;
					viewBoxTop = (imageHeight - patternSourceHeight) / 2 - patternOptions.translateY / objectHeight * patternSourceHeight * rr;
					viewBoxLeft = (imageWidth - patternSourceWidth) / 2 - patternOptions.translateX / objectWidth * patternSourceWidth * rr;
					top = 0;
					left = 0;
					break;
			}

			if (patternSource.src) {
				patternImgSrc = patternSource.src;
			} else if (patternSource.toDataURL) {
				patternImgSrc = patternSource.toDataURL();
			}

			return '<pattern id="SVGID_' + this.id + '" width="' + patternWidth + '%" height="' + patternHeight + '%"' + ' x="' + left + '%"' + ' y="' + top + '%"' +
				' viewBox="' + viewBoxLeft + ',' + viewBoxTop + ',' + patternSourceWidth + ',' + patternSourceHeight + '" >\n' +
				'<image width="' + imageWidth + '" height="' + imageHeight + '" xlink:href="' + patternImgSrc + '"></image>\n' +
				'</pattern>\n';
		},
		getFillScaling: function (object) {
			if (this.fillScaling)
				return this.fillScaling;
			var img = typeof this.source === 'function' ? this.source() : this.source,
				scaleX = object.width / img.width,
				scaleY = object.height / img.height,
				scale = (scaleX > scaleY) ? scaleX : scaleY;
			this.fillScaling = scale;
			return scale;
		},
		setColor: function (color) {
			var im = this.fabricImage;
			if (!im)
				return;
			var filter = im.filters[0];
			if (!filter) {
				filter = new fabric.Image.filters.PatternColor({
					color: color
				});
				im.filters.push(filter);
			}
			filter.color = color;
			im.applyFilters();
			this.source = im.getElement();
			this.color = color;
		},
		getColor: function () {
			var im = this.fabricImage,
				color = this.color || '';
			if (!im)
				return color;
			var filter = im.filters[0];
			if (!filter)
				return color;
			return filter.color;
		}
	});
})(typeof exports !== 'undefined' ? exports : this);

(function (global) {
	'use-strict';
	var fabric = global.fabric,
		opentype = global.opentype,
		Warp = global.Warp;

	if (!fabric) {
		fabric.warn('fabric not defined');
		return;
	}

	if (!opentype) {
		fabric.warn('opentype not defined');
		return;
	}

	if (!Warp) {
		fabric.warn('warp not defined');
		return;
	}

	Warp.prototype.getPathCommands = function () {
		var commands = this.paths[0].pathData;
		for (var i = 0, len = commands.length; i < len; ++i) {
			commands[i].type = commands[i].type.toUpperCase();
		}
		return commands;
	}

	if (fabric.ShapedText) {
		fabric.warn('fabric.ShapedText is already defined');
		return;
	}

	if (!CSSFontFaceRule.prototype.getOpenTypeFont) {
		CSSFontFaceRule.prototype.getOpenTypeFont = async function () {
			if (!this.openTypeFont) {
				var fontPath = this.style.getPropertyValue('src').match(/^url\(("|'|\s)*(.*?)("|'|\s)*\)$/i)[2];
				if (!fontPath.match(/^(http|\/|\\).*$/)) {
					var psFolderPath = this.parentStyleSheet.href;
					fontPath = psFolderPath.substring(0, psFolderPath.lastIndexOf('/')) + "/" + fontPath;
				}
				this.openTypeFont = await opentype.load(fontPath);
			}
			return this.openTypeFont;
		}
	}

	function getFontFaceRules(sheet, obj) {
		if (!obj)
			obj = {
				map: {},
				getFormatedFamily: function (family) {
					return family.match(/^(\s|"|')*(.*?)(\s|"|'|)*$/)[2];
				},
				push: function (o) {
					var map = this.map,
						style = o.style,
						fontFamily = this.getFormatedFamily(style.getPropertyValue('font-family')),
						fontStyle = style.getPropertyValue('font-style');
					var secMap = map[fontFamily];
					if (!secMap) {
						secMap = {};
						map[fontFamily] = secMap;
					}
					map = secMap[fontStyle];
					if (!map) {
						map = {};
						secMap[fontStyle] = map;
					}
					map[style.getPropertyValue("font-weight")] = o;
				},
				cloneObj: function (obj, prop, callback) {
					if (!obj)
						return;
					if (prop) {
						var f = callback ? callback(obj, prop) : obj[prop];
						if (!f) return;
						obj = {};
						obj[prop] = f;
					} else {
						obj = { ...obj };
					}
					return obj;
				},
				mapFontWieght: function (obj, fontWeight) {
					switch (fontWeight) {
						case 'lighter':
							fontWeight = -1;
							for (var p in obj)
								if (fontWeight == -1 || fontWeight > Number(p))
									fontWeight = Number(p);
							break;
						case 'normal':
							fontWeight = 400;
							break;
						case 'bold':
							fontWeight = 700;
							break;
						case 'bolder':
							fontWeight = -1;
							for (var p in obj)
								if (fontWeight < Number(p))
									fontWeight = Number(p);
							break;
					}
					return obj[fontWeight];
				},
				getCSSFontFaceRules: function (fontFamily, fontStyle, fontWeight) {
					var obj = {}, me = this;
					fontFamily.split(",").forEach(function (family) {
						family = me.getFormatedFamily(family);
						var font = me.cloneObj(me.map[family], fontStyle);
						if (!font) return;
						for (var s in font) {
							var st = me.cloneObj(font[s], fontWeight, fontWeight ? me.mapFontWieght : undefined);
							if (!st) continue;
							font[s] = st;
						}
						obj[family] = font;
					});
					return obj;
				},
				getOpenTypeFont: function (fontFamily, fontStyle, fontWeight) {
					var rules = this.getCSSFontFaceRules(fontFamily, fontStyle, fontWeight);
					for (var p in rules)
						if (p != 'Notdef') {
							fontFamily = p;
							break;
						}
					rules = rules[fontFamily][fontStyle][fontWeight];
					return rules.getOpenTypeFont();
				}
			};
		if (sheet instanceof StyleSheetList || sheet instanceof CSSRuleList) {
			for (var i = 0; i < sheet.length; ++i)
				getFontFaceRules(sheet[i], obj);
		} else if (sheet instanceof CSSStyleSheet) {
			try {
				getFontFaceRules((sheet.rules || sheet.cssRules), obj);
			} catch (e) {
				console.warn("Can't read the css rules of: " + sheet.href, e);
			}
		} else if (sheet instanceof CSSImportRule) {
			getFontFaceRules(sheet.styleSheet, obj);
		} else if (sheet instanceof CSSFontFaceRule) {
			obj.push(sheet);
		}
		return obj;
	}

	function set(key, value) {
		var res = this.callSuper('set', key, value),
			needToRerender = false,
			restoreField = this.openTypeFontRestoreField;
		if (typeof key === 'object') {
			var keys = Object.keys(key);
			needToRerender = keys.some(function (field) {
				return restoreField.has(field)
			});
		} else {
			needToRerender = restoreField.has(key);
		}
		if (needToRerender)
			this.loadFontAndRerender();
		return res;
	}

	var getSvgColorString = fabric.util.getSvgColorString;

	var body = document.querySelector('body'),
		dummy = document.createElement('div');
	dummy.style.position = "absolute";
	dummy.style.color = "transparent";
	dummy.style.zIndex = "-10";

	body.appendChild(dummy);
	fabric.util.fontLoader = {
		loadFontList: function () {
			this.fontRuleMap = getFontFaceRules(document.styleSheets, this.fontRuleMap);
		},
		loadFont: function (fontFamily, fontStyle, fontWeight) {
			return this.fontRuleMap.getOpenTypeFont(fontFamily, fontStyle, fontWeight);
		},
		loadFonts: async function (fonts) {
			if (!fonts || !fonts.length) {
				return;
			}
			fonts.forEach(function (fo) {
				var loader = document.createElement('div');
				loader.style.fontFamily = fo.fontFamily;
				loader.style.fontStyle = fo.fontStyle;
				loader.style.fontWeight = fo.fontWeight;
				loader.innerHTML = 'loading';
				dummy.appendChild(loader);
			});
			await document.fonts.ready;
			dummy.innerHTML = '';
		}
	}
	fabric.util.fontLoader.loadFontList();

	fabric.ShapedText = fabric.util.createClass(fabric.Text, {
		type: 'shaped-text',
		warpMode: 0,
		warpAmount: 5,
		strokeWidth: 0.00001,
		warpRestoreField: new Set(['warpMode', 'warpAmount', 'text', 'underline', 'fontFamily', 'fontStyle', 'fontWeight', 'tracking', 'fontSize']),
		openTypeFontRestoreField: new Set(['fontFamily', 'fontStyle', 'fontWeight', 'fontSize']),
		dimRestoreField: new Set(['tracking', 'underline', 'warpMode', 'warpAmount', 'fontSize']),
		addonDirtFields: new Set(['textAlign']),
		tracking: 0,
		initialize: function (text, options) {
			this.callSuper('initialize', text, options);
			this.set = set;
			this.loadFontAndRerender();
		},
		loadFontAndRerender: async function () {
			try {
				await this.loadFont();
				this.textPath = null;
				this.dirty = true;
				this.initDimensions();
				if (this.canvas) {
					this.canvas.renderAll();
				}
			} catch (err) { }
		},
		loadFont: async function (callback) {
			this.font = await fabric.util.fontLoader.loadFont(this.fontFamily, this.fontStyle, this.fontWeight);
			callback && callback.call(this, this.font);
		},
		getWarp: function (paths) {
			var warp;
			if (!this.warp) {
				var dummy = document.createElement('svg');
				this.warp = new Warp(dummy);
			}
			warp = this.warp;
			for (var i = 0, len = paths.length; i < len; ++i) {
				paths[i].type = paths[i].type.toLowerCase();
				paths[i].relative = false;
			}
			warp.paths = [{
				pathData: paths,
				pathElement: warp.element
			}];
			return this.warp;
		},
		getWrappedPoint: function (x, y, warpMode, warpAmount, height, width) {
			var a = 1e8;
			var e = Math.floor(x / width * a),
				t = Math.ceil(-y / height * a);

			var v = a, s = a, c = height, d = width, p = { x: 0, y: 0 };
			p.x = d / (s - 1) * e;
			p.y = c / (v - 1) * t;
			var u = Math.abs(warpAmount);
			switch (warpMode) {
				case 1:
					p.y += c / 5 * Math.pow((-1 + v - 2 * e) / v, 2) * warpAmount;
					break;
				case 2:
					warpAmount = -u;
					p.y -= c / 5 * Math.pow((-1 + v - 2 * e) / v, 2) * Math.abs(warpAmount);
					break;
				case 3:
					p.y = -c / 2 + c / v * t;
					warpAmount = u;
					p.y += c / 5 * Math.pow((-1 + v - 2 * e) / v, 2) * warpAmount * (t / v);
					p.y -= t / v * (warpAmount * (c / 40));
					p.y += c / 2;
					break;
				case 4:
					warpAmount = -u;
					p.y -= c / 5 * Math.pow((-1 + v - 2 * e) / v, 2) * Math.abs(warpAmount) * ((v - t) / v);
					p.y -= (v - t) / v * (warpAmount * (c / 40));
					p.y += c / 2;
					break;
				case 5:
					p.y = -c / 2 + c / v * t;
					p.y += c / 5 * Math.pow((-1 + v - 1 * e) / v, 2) * warpAmount * (t / v);
					p.y -= t / v * (warpAmount * (c / 40));
					p.y += c / 2;
					break;
				case 6:
					p.y = -c / 2 + c / v * t;
					p.y += c / 5 * ((-1 + v - 1 * e) / v) * warpAmount * (t / v);
					p.y -= t / v * (warpAmount * (c / 40));
					p.y += c / 2;
					break;
				case 7:
					warpAmount = -u;
					p.y = -c / 2 + c / v * t;
					p.y *= e < v / 2 ? Math.pow((v / 2 - 2 * e) / (v / 4) * (warpAmount / 10) - 1, 2) : Math.pow((v / 2 - 2 * (v - 1 - e)) / (v / 4) * (warpAmount / 10) - 1, 2);
					p.y -= 2 * c * ((v - t) / v / 2);
					break;
				case 8:
					p.y = -c / 2 + c / v * t;
					p.y += c / 5 * (-e / v) * warpAmount * ((v - t) / v);
					p.y -= t / v * (warpAmount * (c / 40));
					p.y += c / 2;
					break;
				case 9:
					p.y += c / 5 * Math.pow((-1 + v - 1 * e) / v, 2) * warpAmount;
					break;
				case 10:
					p.y = -c / 2 + c / v * t;
					p.y += c / 5 * Math.pow(e / v, 2) * warpAmount * (t / v);
					p.y -= t / v * (warpAmount * (c / 40));
					p.y += c / 2;
					break;
				case 11:
					p.y += c / 5 * Math.cos(e / v * Math.PI * 2) * warpAmount * (t / s) * .5;
					break;
				case 12:
					p.y += c / 5 * Math.cos(e / v * Math.PI * 2 + Math.PI) * warpAmount * ((s - t) / s) * .5;
					break;
				case 13:
					p.y += c / 5 * Math.pow((-1 + v - (v - e)) / v, 2) * warpAmount;
					break;
				case 14:
					p.y = 2 * (c / s * t * (v - e * (warpAmount / 10)) / v + e / v * (c / 2 * (warpAmount / 10)));
					break;
				case 15:
					warpAmount = -u;
					p.y = 2 * (c / v * t * (v - (v - e) * (Math.abs(warpAmount) / 10)) / v + (v - e) / v * (c / 2 * (Math.abs(warpAmount) / 10)));
					break;
				case 16:
					warpAmount = -u;
					p.y -= c / 5 * Math.pow((-1 + v - 2 * e) / v, 2) * Math.abs(warpAmount) * (t / s);
					p.y -= 2 * c * ((v - t) / v / 2);
					break;
				case 17:
					p.y += c / 5 * Math.pow((-1 + v - 2 * e) / v, 2) * warpAmount * ((s - t) / s);
					p.y -= 2 * c * ((v - t) / v / 2);
					break;
				case 18:
					p.y = -c / 2 + c / v * t;
					p.y += c / 5 * -Math.pow(e / v, 2) * warpAmount * ((v - t) / v);
					p.y -= t / v * (warpAmount * (c / 40));
					p.y += c / 2;
					break;
				case 19:
					warpAmount = u;
					p.y += c / 5 * Math.cos(e / v * Math.PI * 2 + Math.PI) * warpAmount * (t / s) / 2;
					p.y -= 2 * c * ((v - t) / v / 2);
					break;
				case 20:
					p.y += c / 10 * Math.cos(e / v * Math.PI * 2) * warpAmount;
					break;
				case 21:
					p.y = -c / 2 + c / v * t;
					p.y *= e < v / 2 ? Math.sqrt(1 - (v / 2 - 4 * e) / (v / 2) * (warpAmount / 10)) : Math.sqrt(Math.max(0, 1 - (v / 2 - 4 * (v - 1 - e)) / (v / 2) * (warpAmount / 10)));
					break;
				case 22:
					p.y = c / v * t;
					p.x = -d / 2 + d / s * e;
					p.x *= (1 + (s - 2 * t) / s * (warpAmount / 10)) / (2 - (10 - warpAmount) / 10);
					p.x += d / 2;
					break;
				case 23:
					warpAmount = -u;
					p.y = c / v * t;
					p.x = -d / 2 + d / s * e;
					p.x *= (1 + (2 * t - s) / s * (Math.abs(warpAmount) / 10)) / (2 - (10 - Math.abs(warpAmount)) / 10);
					p.x += d / 2;
					break;
				case 24:
					p.y += c / 10 * Math.cos(Math.PI / 1.5 + e / v * Math.PI * 2) * warpAmount;
					break;
				case 25:
					warpAmount = -u;
					p.y += c / 10 * Math.sin(Math.PI / 1.5 + e / v * Math.PI * 2) * warpAmount;
					break;
				case 26:
					p.y += c / 10 * Math.cos(Math.PI + e / v * Math.PI) * warpAmount;
					break;
				case 27:
					warpAmount = -u;
					p.y += c / 10 * Math.cos(2 * Math.PI + Math.PI + e / v * Math.PI) * warpAmount;
					break;
				case 28:
					p.x += c / 10 * (t / v) * (warpAmount = -u);
					break;
				case 29:
					p.x += c / 10 * (t / v) * warpAmount;
					break;
				case 30:
					p.y += c / 5 * Math.abs((-1 + v - 2 * e) / v) * warpAmount;
					break;
				case 31:
					warpAmount = -u;
					p.y -= c / 5 * Math.abs((-1 + v - 2 * e) / v) * Math.abs(warpAmount);
			}
			return [p.x, -p.y];
		},
		toSVG: function (reviver) {
			if (!this.text) {
				return '';
			}
			return this._createBaseSVGMarkup(this._toSVG(reviver), { reviver: reviver });
		},
		getStrokeStyle: function (stroke) {
			var strokeWidth = stroke.strokeWidth,
				stroke = getSvgColorString('stroke', stroke.stroke);
			return [
				stroke,
				'stroke-width: ', strokeWidth, '; ',
				'white-space: pre;'
			].join('');
		},
		emitExtraStroke: function (stroke) {
			return 'style="' + this.getStrokeStyle(stroke) + '" ';
		},
		_render: function (ctx) {
			if (!this.font)
				return this.callSuper('_render', ctx);
			var path = this.getTextPath(),
				bbox = path.getBoundingBox(),
				me = this;

			ctx.save();
			var tx = bbox.x1 + this.width / 2,
				ty = bbox.y1 + this.height / 2;
			ctx.transform(1, 0, 0, 1, -tx, -ty);
			path.fill = this.fill;
			path.stroke = this.stroke || this.extraStrokes;
			path.strokeWidth = this.strokeWidth;
			var origFill = ctx.fill,
				origStroke = ctx.stroke,
				extraStrokes = this.getExtraStrokes();
			if (extraStrokes.length) {
				ctx.fill = function () { };
				ctx.stroke = function () {
					ctx.save();
					ctx.transform(1, 0, 0, 1, tx, ty);
					var args = arguments;
					extraStrokes.forEach(function (dec) {
						me._setStrokeStyles(ctx, dec);
						origStroke.apply(ctx, args);
					});
					ctx.restore();
				};
				path.draw(ctx);
			}

			ctx.fill = function () {
				ctx.save();
				ctx.transform(1, 0, 0, 1, tx, ty);
				me._setFillStyles(ctx, me);
				origFill.apply(ctx, arguments);
				ctx.restore();
			};
			ctx.stroke = function () {
				ctx.save();
				ctx.transform(1, 0, 0, 1, tx, ty);
				me._setStrokeStyles(ctx, me);
				origStroke.apply(ctx, arguments);
				ctx.restore();
			};
			path.draw(ctx);

			delete ctx.fill;
			delete ctx.stroke;
			ctx.restore();
		},
		transformMatrixKey: function (skipGroup) {
			return this.callSuper('transformMatrixKey', skipGroup) + this.getEStrokeWidth();
		},
		getEStrokeWidth: function () {
			if (!this.extraStrokes) {
				return 0;
			}
			var strokeWidth = this.strokeWidth;
			return this.extraStrokes.reduce(function (p, c) {
				return p + (c.strokeWidth || strokeWidth)
			}, 0);
		},
		_getNonTransformedDimensions: function () {
			var strokeWidth = this.strokeWidth + this.getEStrokeWidth() * 2,
				w = this.width + strokeWidth,
				h = this.height + strokeWidth;
			return { x: w, y: h };
		},
		handleFiller: function (ctx, property, filler) {
			if (filler && filler.toLive) {
				ctx[property] = filler.toLive(ctx, this);
				return this._applyPatternGradientTransform(ctx, filler);
			}
			else {
				ctx[property] = filler || '';
			}
			return { offsetX: 0, offsetY: 0 };
		},
		_getPath: function (font) {
			var tracking = this.tracking;
			return font.getPath(this.text, 0, 0, this.fontSize, {
				tracking: tracking
			});
		},
		getTextPath: function () {
			if (this.textPath)
				return this.textPath;
			var path = this._getPath(this.font),
				bbox = path.getBoundingBox(),
				width = Math.abs(bbox.x2 - bbox.x1),
				height = Math.abs(bbox.y2 - bbox.y1),
				warpMode = this.warpMode,
				warpAmount = this.warpAmount;

			if (this.underline) {
				var height = this.getHeightOfLine(0),
					uoffset = this.offsets.underline,
					uPos = uoffset * height * 0.8,
					dWidth = uoffset * uoffset * height;
				path.commands.push({ type: "M", x: bbox.x1 - dWidth, y: uPos, relative: false });
				path.commands.push({ type: "L", x: bbox.x2 + dWidth, y: uPos, relative: false });
				path.commands.push({ type: "L", x: bbox.x2 + dWidth, y: uPos + this.fontSize / 15, relative: false });
				path.commands.push({ type: "L", x: bbox.x1 - dWidth, y: uPos + this.fontSize / 15, relative: false });
				path.commands.push({ type: "Z", relative: false });
			}
			if (warpMode) {
				var warp = this.getWarp(path.commands);
				warp.interpolate(width / this.text.length / this.scaleX / 5);
				warp.transform(([x, y]) => this.getWrappedPoint(x, y, warpMode, warpAmount, height, width));
				path.commands = warp.getPathCommands();
			}
			this.textPath = path;
			return path;
		},
		_set: function (key, value) {
			this[key] = value;
			if (this.warpRestoreField.has(key)) {
				this.textPath = null;
				this.dirty = true;
			} else if (this.addonDirtFields.has(key)) {
				this.dirty = true;
			}
			if (this.dimRestoreField.has(key)) {
				this.initDimensions();
			}
		},
		calcTextWidth: function () {
			if (!this.font)
				return this.callSuper('calcTextWidth');
			var bbox = this.getTextPath().getBoundingBox();
			this.width = Math.abs(bbox.x2 - bbox.x1);
			return this.width;
		},
		calcTextHeight: function () {
			if (!this.font)
				return this.callSuper('calcTextHeight');
			var bbox = this.getTextPath().getBoundingBox();
			this.height = Math.abs(bbox.y2 - bbox.y1);
			return this.height;
		},
		_toSVG: function () {
			var addTransform = '',
				tPath = this.getTextPath(),
				path = tPath.toPathData(),
				bbox = tPath.getBoundingBox();
			addTransform = ' translate(' + -(bbox.x1 + this.width / 2) + ', ' + -(bbox.y1 + this.height / 2) + ')';
			return [
				'<path ', 'COMMON_PARTS',
				'd="', path,
				'" stroke-linecap="round" ',
				'transform="', addTransform, '"',
				'/>\n'
			];
		},
		toObject: function (propertiesToInclude) {
			var additionalProperties = [
				'warpMode',
				'warpAmount',
				'tracking',
				'extraStrokes'
			].concat(propertiesToInclude);
			var obj = this.callSuper('toObject', additionalProperties);
			if (obj.extraStrokes) {
				obj.extraStrokes = JSON.parse(JSON.stringify(obj.extraStrokes));
			}
			return obj;
		}
	});
	function parseDecoration(object) {
		if (object.textDecoration) {
			object.textDecoration.indexOf('underline') > -1 && (object.underline = true);
			object.textDecoration.indexOf('line-through') > -1 && (object.linethrough = true);
			object.textDecoration.indexOf('overline') > -1 && (object.overline = true);
			delete object.textDecoration;
		}
	}
	fabric.ShapedText.fromObject = function (object, callback) {
		parseDecoration(object);
		if (object.styles) {
			for (var i in object.styles) {
				for (var j in object.styles[i]) {
					parseDecoration(object.styles[i][j]);
				}
			}
		}
		return fabric.Object._fromObject('ShapedText', object, callback, 'shaped-text');
	}
})(typeof exports !== 'undefined' ? exports : this);



(function (global) {

	'use strict';

	var fabric = global.fabric || (global.fabric = {}),
		opentype = global.opentype,
		multiplyTransformMatrices = fabric.util.multiplyTransformMatrices;

	if (fabric.CurvedText) {
		fabric.warn('fabric.CurvedText is already defined');
		return;
	}

	function multiplyMatrix(...ms) {
		var res = ms.length ? ms[0] : [1, 0, 0, 1, 0, 0];
		for (var i = 1, len = ms.length; i < len; ++i) {
			res = multiplyTransformMatrices(res, ms[i]);
		}
		return res;
	}

	function getTransformedPart(cmd, x, y, t) {
		var px = cmd[x];
		var py = cmd[y];
		cmd[x] = t[0] * px + t[2] * py + t[4];
		cmd[y] = t[1] * px + t[3] * py + t[5];
	}

	opentype.Path.prototype.transform = function (matrix) {
		var commands = this.commands;
		for (var i = 0; i < commands.length; i++) {
			var s = commands[i];
			switch (s.type) {
				case "C":
					getTransformedPart(s, 'x2', 'y2', matrix);
				case "Q":
					getTransformedPart(s, 'x1', 'y1', matrix);
				case "M":
				case "L":
					getTransformedPart(s, 'x', 'y', matrix);
					break;
				case "Z":
					break;
				default:
					throw new Error("Unexpected path command " + s.type)
			}
		}
	}

	var makePathSimpler = fabric.util.makePathSimpler;
	function getOpenTypePath(path) {
		path = makePathSimpler(path);
		var destPath = new opentype.Path(),
			commands = destPath.commands;
		for (var i = 0; i < path.length; i++) {
			var s = path[i];
			var dest = {
				type: s[0]
			};
			switch (s[0]) {
				case "M":
				case "L":
					dest.x = s[1];
					dest.y = s[2];
					break;
				case "C":
					dest.x1 = s[1];
					dest.y1 = s[2];
					dest.x2 = s[3];
					dest.y2 = s[4];
					dest.x = s[5];
					dest.y = s[6];
					break;
				case "Q":
					dest.x1 = s[1];
					dest.y1 = s[2];
					dest.x = s[3];
					dest.y = s[4];
					break;
				case "Z":
					break;
				default:
					throw new Error("Unexpected path command ");
			}
			commands.push(dest);
		}
		return destPath;
	}

	function getRotationMatrix(rad) {
		var sin = Math.sin(rad),
			cos = Math.cos(rad);
		return [cos, sin, -sin, cos, 0, 0];
	}

	var piX2 = 2 * Math.PI;
	fabric.CurvedText = fabric.util.createClass(fabric.ShapedText, {
		type: 'curved-text',
		radius: 50,
		placement: 'outside',
		dimRestoreField: new Set(['tracking', 'underline', 'warpMode', 'warpAmount', 'radius', 'placement', 'fontSize']),
		warpRestoreField: new Set(['radius', 'text', 'underline', 'fontFamily', 'fontStyle', 'fontWeight', 'underline', 'tracking', 'placement', 'fontSize']),
		_getPath: function (font) {
			var s = new opentype.Path(),
				multiplier = (this.placement === 'inside') ? -1 : 1,
				angleFactor = this.radius * multiplier,
				originY = (this.placement === 'inside') ? -(this.radius + this.fontSize) : this.radius,
				o = {
					tracking: this.tracking
				};
			var calcTextWidth = 0,
				widthFactor = this.fontSize / font.unitsPerEm,
				m1 = [1, 0, 0, 1, 0, -originY],
				m2 = [1, 0, 0, 1, 0, originY];
			font.forEachGlyph(this.text, 0, 0, this.fontSize, o, function (e, t, r, n) {
				var a = e.getPath(0, 0, n, o, this),
					glyphWidth = e.advanceWidth * widthFactor,
					half = glyphWidth / 2;
				a.transform(multiplyMatrix(
					m2, getRotationMatrix(t / angleFactor), m1,
					[1, 0, 0, 1, half, 0], getRotationMatrix(half / angleFactor), [1, 0, 0, 1, -half, 0]
				));
				s.extend(a);
				calcTextWidth = t + glyphWidth;
			});

			var endAngle = Math.abs(calcTextWidth / angleFactor);
			if (this.underline) {
				var e = endAngle > piX2 ? piX2 : endAngle;
				s.extend(this._getUnderlinePathPoints(0, e, e > Math.PI));
			}
			s.transform(getRotationMatrix(-multiplier * endAngle / 2));
			return s;
		},
		__getY: function (angle, dRadius) {
			var placement = this.placement;
			var radius = this.radius;
			if (dRadius)
				radius += dRadius;
			if (placement === 'outside') {
				return this.radius - fabric.util.cos(angle) * radius;
			} else {
				var fontSize = this.fontSize;
				radius += fontSize;
				return fabric.util.cos(angle) * radius - (this.radius + fontSize);
			}
		},
		__getX: function (angle, dRadius) {
			var radius = this.radius;
			radius = (this.placement !== 'inside') ? radius : (radius + this.fontSize);
			if (dRadius)
				radius += dRadius;
			return fabric.util.sin(angle) * radius;
		},
		_getUnderlinePathPoints: function (startAngle, endAngle, largeFlag) {
			var multiplier = (this.placement === 'inside') ? 1 : -1,
				dr = multiplier * this.fontSize / 15;
			var startY1 = this.__getY(startAngle, dr),
				startX1 = this.__getX(startAngle, dr),
				endY1 = this.__getY(endAngle, dr),
				endX1 = this.__getX(endAngle, dr);

			largeFlag = largeFlag ? 1 : 0;
			var path = [];

			var sweepFlag = (this.placement === 'outside') ? 1 : 0,
				radius = this.radius;
			if (this.placement === 'inside') {
				radius += this.fontSize;
			}
			path.push(
				['M', startX1, startY1],
				['A', radius + dr, radius + dr, 0, largeFlag, sweepFlag, endX1, endY1]
			);

			dr += multiplier * this.fontSize / 15;
			var startY2 = this.__getY(startAngle, dr),
				startX2 = this.__getX(startAngle, dr),
				endY2 = this.__getY(endAngle, dr),
				endX2 = this.__getX(endAngle, dr);

			path.push(['L', endX2, endY2]);
			sweepFlag = (this.placement === 'outside') ? 0 : 1;

			path.push(
				['A', radius + dr, radius + dr, 0, largeFlag, sweepFlag, startX2, startY2]
			);

			path.push(['Z']);
			return getOpenTypePath(path);
		},
		setText: function (txt) {
			this.set('text', txt);
		},
		getTextPath: function () {
			if (this.textPath)
				return this.textPath;
			var path = this._getPath(this.font);
			this.textPath = path;
			return path;
		},
		toObject: function (propertiesToInclude) {
			var additionalProperties = [
				'radius',
				'spacing',
				'placement'
			].concat(propertiesToInclude);
			var obj = this.callSuper('toObject', additionalProperties);
			if (obj.extraStrokes) {
				obj.extraStrokes = JSON.parse(JSON.stringify(obj.extraStrokes));
			}
			return obj;
		}
	});

	fabric.CurvedText.fromObject = function (object, callback) {
		return fabric.Object._fromObject('CurvedText', object, callback, 'text');
	};
})(typeof exports !== 'undefined' ? exports : this);


(function (global) {
	'use strict';
	var fabric = global.fabric || (global.fabric = {});

	// for gpu acceleration.
	fabric.Canvas2dFilterBackend.prototype.applyFilters = function (filters, sourceElement, sourceWidth, sourceHeight, targetCanvas) {
		var ctx = targetCanvas.getContext('2d', { willReadFrequently: true });
		ctx.drawImage(sourceElement, 0, 0, sourceWidth, sourceHeight);
		var imageData = ctx.getImageData(0, 0, sourceWidth, sourceHeight);
		var originalImageData = ctx.getImageData(0, 0, sourceWidth, sourceHeight);
		var pipelineState = {
			sourceWidth: sourceWidth,
			sourceHeight: sourceHeight,
			imageData: imageData,
			originalEl: sourceElement,
			originalImageData: originalImageData,
			canvasEl: targetCanvas,
			ctx: ctx,
			filterBackend: this,
		};
		filters.forEach(function (filter) { filter.applyTo(pipelineState); });
		if (pipelineState.imageData.width !== sourceWidth || pipelineState.imageData.height !== sourceHeight) {
			targetCanvas.width = pipelineState.imageData.width;
			targetCanvas.height = pipelineState.imageData.height;
		}
		ctx.putImageData(pipelineState.imageData, 0, 0);
		return pipelineState;
	}

})(typeof exports !== 'undefined' ? exports : this);


(function (global) {

	'use strict';

	var fabric = global.fabric || (global.fabric = {});

	if (fabric.Overlay) {
		fabric.warn('fabric.Overlay is already defined');
		return;
	}

	fabric.Overlay = fabric.util.createClass(fabric.Image, {
		type: 'overlay',
		trX: 0,
		trY: 0,
		setColor: function (color) {
			var filter = this.filters[0];
			if (!filter) {
				filter = new fabric.Image.filters.PatternColor({
					color: color
				});
				this.filters.push(filter);
			}
			filter.color = color;
			this.applyFilters();
		},
		getColor: function () {
			var filter = this.filters[0];
			if (!filter)
				return '';
			return filter.color;
		},
		getSvgSrc: function () {
			var src = this.filePath;
			if (src) {
				src = new URL(src, window.location.href);
				return src.href;
			}
			return this.getHiThumbSrc();
		},
		getThumbSrc: function () {
			var src = this.thumbPath;
			if (src) {
				src = new URL(src, window.location.href);
				return src.href;
			}
			return this.getHiThumbSrc();
		},
		getHiThumbSrc: function () {
			return this._originalElement?.src || '';
		},
		_toSVG: function () {
			var svgString = [], imageMarkup = [], strokeSvg, element = this._element,
				x = -this.width / 2, y = -this.height / 2, clipPath = '', imageRendering = '',
				tint = '';
			if (!element) {
				return [];
			}
			if (this.hasCrop()) {
				var clipPathId = fabric.Object.__uid++;
				svgString.push(
					'<clipPath id="imageCrop_' + clipPathId + '">\n',
					'\t<rect x="' + x + '" y="' + y + '" width="' + this.width + '" height="' + this.height + '" />\n',
					'</clipPath>\n'
				);
				clipPath = ' clip-path="url(#imageCrop_' + clipPathId + ')" ';
			}
			if (!this.imageSmoothing) {
				imageRendering = '" image-rendering="optimizeSpeed';
			}

			var filters = this.filters;
			if (filters && filters.length) {
				for (var filter of filters) {
					if (filter instanceof fabric.Image.filters.PatternColor) {
						tint = ' data-tint="' + filter.color + '"';
					}
				}
			}

			imageMarkup.push('\t<image ', 'COMMON_PARTS', 'xlink:href="', this.getSvgSrc(true),
				'" x="', x - this.cropX, '" y="', y - this.cropY,
				'" width="', element.width || element.naturalWidth,
				'" height="', element.height || element.height,
				imageRendering,
				'"', clipPath, tint,
				' data-thumb-path="', this.getThumbSrc(),
				'"></image>\n');

			if (this.stroke || this.strokeDashArray) {
				var origFill = this.fill;
				this.fill = null;
				strokeSvg = [
					'\t<rect ',
					'x="', x, '" y="', y,
					'" width="', this.width, '" height="', this.height,
					'" style="', this.getSvgStyles(),
					'"/>\n'
				];
				this.fill = origFill;
			}
			if (this.paintFirst !== 'fill') {
				svgString = svgString.concat(strokeSvg, imageMarkup);
			}
			else {
				svgString = svgString.concat(imageMarkup, strokeSvg);
			}
			return svgString;
		},
		toObject: function (propsToInc) {
			var obj = this.callSuper('toObject', propsToInc);
			obj.trX = this.trX;
			obj.trY = this.trY;
			return obj;
		}
	});

	fabric.Overlay.fromObject = function (_object, callback) {
		var object = fabric.util.object.clone(_object);
		fabric.util.loadImage(object.src, function (img, isError) {
			if (isError) {
				callback && callback(null, true);
				return;
			}
			fabric.Image.prototype._initFilters.call(object, object.filters, function (filters) {
				object.filters = filters || [];
				fabric.Image.prototype._initFilters.call(object, [object.resizeFilter], function (resizeFilters) {
					object.resizeFilter = resizeFilters[0];
					fabric.util.enlivenObjects([object.clipPath], function (enlivedProps) {
						object.clipPath = enlivedProps[0];
						callback(new fabric.Overlay(img, object), false);
					});
				});
			});
		}, null, object.crossOrigin);
	};

	fabric.Overlay.fromURL = function (url, callback, imgOptions) {
		fabric.util.loadImage(url, function (img, isError) {
			callback && callback(new fabric.Overlay(img, imgOptions), isError);
		}, null, imgOptions && imgOptions.crossOrigin);
	};
})(typeof exports !== 'undefined' ? exports : this);

(function (global) {
	'use strict';

	var fabric = global.fabric || (global.fabric = {});
	if (!fabric.Textbox) {
		fabric.warn('fabric.Textbox is not defined');
		return;
	}

	fabric.Textbox.helpers = fabric.Textbox.helpers || {};
	fabric.Textbox.helpers.Placeholder = fabric.util.createClass(fabric.Text, {
		initialize: function (text, options, target) {
			this.callSuper('initialize', text, options);
			this.target = target;
		},
		_getLeftOffset: function () {
			if (this.target) {
				return this.target._getLeftOffset();
			} else {
				return this.callSuper('_getLeftOffset');
			}
		},
		parentProps: ['textAlign', 'width'],
		setParentProps: function () {
			var parent = this.target;
			if (parent) {
				for (var prop of this.parentProps) {
					this.set(prop, parent[prop]);
				}
			}
		}
	})

	fabric.util.addPrototypeProps(fabric.Textbox, {
		placeholderText: "Type your text here...",
		placeholderProps: {
			fill: "#999",
			fontSize: 12,
			left: 15
		},
		initialize: function (text, options) {
			this.callSuper('initialize', text, options);
			this.placeholder = new fabric.Textbox.helpers.Placeholder(this.placeholderText, this.placeholderProps, this);
		},
		toObject: function (propertiesToInclude) {
			var additionalProperties = [
				'placeholderText',
				'lockMovementX',
				'lockMovementY',
				'textAlign'
			].concat(propertiesToInclude);
			return this.callSuper('toObject', additionalProperties);
		},
		_renderTextCommon: function (ctx, method) {
			if (!this.text) {
				this.placeholder.setParentProps();
				this.placeholder._renderTextCommon(ctx, method);
			} else {
				this.callSuper('_renderTextCommon', ctx, method);
			}
		}
	});
})(typeof exports !== 'undefined' ? exports : this);


(function (global) {

	'use strict';

	var fabric = global.fabric || (global.fabric = {});

	if (fabric.ImageBox) {
		fabric.warn('fabric.ImageBox is already defined');
		return;
	}

	fabric.ImageBox = fabric.util.createClass(fabric.Image, {
		type: 'imageBox',
		effectiveWidth: 35,
		effectiveHeight: 42,
		dpi: 150,
		initialize: function (element, options) {
			this.callSuper("initialize", element, options);
			this.on('mouseup', this.mouseUpHandler);
			this.on('mousedown', this.onMouseDown);
			var el = document.createElement('input');
			el.type = 'file';
			el.accept = "image/png, image/jpeg";
			var style = el.style;
			style.position = 'absolute';
			style.opacity = 0;
			style['border-radius'] = '50%';
			style.transform = 'translate(-50%, -50%)';
			style.cursor = 'pointer';

			el.onchange = this.onFileChange.bind(this);
			this.inputEl = el;

			this.on('selected', function () {
				var target = this.canvas?.lowerCanvasEl?.parentElement;
				if (target) {
					target.appendChild(el);
				}
			});

			this.on('deselected', function () {
				var target = this.canvas?.lowerCanvasEl?.parentElement;
				if (target) {
					target.removeChild(el);
				}
			});
		},
		toObject: function (propertiesToInclude) {
			var additionalProperties = [
				'lockMovementX',
				'lockMovementY',
				'effectiveWidth',
				'effectiveHeight',
				'placeholderSrc'
			].concat(propertiesToInclude);
			return this.callSuper('toObject', additionalProperties);
		},
		onFileChange: function (e) {
			var file = e.target.files[0];
			if (file) {
				this.updateSrc(URL.createObjectURL(file));
			}
		},
		updateSrc: function (url, skip) {
			this.setSrc(url, function (obj, isError) {
				if (!isError && (obj.effectiveWidth || obj.effectiveHeight)) {
					var sx = obj.effectiveWidth / obj.width,
						sy = obj.effectiveHeight / obj.height,
						sz = sx > sy ? sx : sy,
						canvas = obj.canvas;
					obj.scaleX = sz;
					obj.scaleY = sz;
					obj.dirty = true;
					if (canvas && !skip) {
						canvas.fire('object:modified', { target: obj });
						canvas.renderAll();
					}
				}
			});
		},
		saveImage: function (cb) {
			var me = this;
			return new Promise(function (accept, reject) {
				var src = me.getSrc();
				if (src && src.startsWith('blob:')) {
					fetch(src).then(function (res) {
						return res.blob();
					}).then(async function (blob) {
						let url = await cb && cb(blob);
						accept(url);
					}).catch(reject);
				} else {
					accept(src);
				}
			})
		}
	});

	var controls = {};
	Object.assign(controls, fabric.Image.prototype.controls);
	fabric.ImageBox.prototype.controls = controls;

	var updateIcon = new Image(),
		renderIconControl = fabric.controlsUtils.renderIconControl;
	updateIcon.src = '/resources/icons/updateImg.png';

	fabric.ImageBox.prototype.controls.tl = new fabric.Control({
		x: -0.5,
		y: -0.5,
		cursorStyleHandler: function () {
			return 'pointer';
		},
		getActionName: function () {
			return 'updateImage';
		},
		render: function (ctx, left, top, styleOverride, fabricObject) {
			ctx.save();
			var styleOverrides = {};
			renderIconControl.call(this, ctx, left, top, updateIcon, styleOverrides);
			var style = fabricObject?.inputEl?.style;
			if (style) {
				style.width = styleOverrides.cornerSize + 'px';
				style.height = styleOverrides.cornerSize + 'px';
				style.left = left + 'px';
				style.top = top + 'px';
			}
			ctx.restore();
		}
	});

	fabric.ImageBox.fromObject = function (_object, callback) {
		var object = fabric.util.object.clone(_object);
		fabric.util.loadImage(object.src, function (img, isError) {
			if (isError) {
				callback && callback(null, true);
				return;
			}
			fabric.Image.prototype._initFilters.call(object, object.filters, function (filters) {
				object.filters = filters || [];
				fabric.Image.prototype._initFilters.call(object, [object.resizeFilter], function (resizeFilters) {
					object.resizeFilter = resizeFilters[0];
					fabric.util.enlivenObjects([object.clipPath], function (enlivedProps) {
						object.clipPath = enlivedProps[0];
						callback(new fabric.ImageBox(img, object), false);
					});
				});
			});
		}, null, object.crossOrigin);
	};
})(typeof exports !== 'undefined' ? exports : this);


(function (global) {

	'use strict';

	var fabric = global.fabric || (global.fabric = {}),
		GraphemeSplitter = global.GraphemeSplitter;

	if (fabric.TextArea) {
		fabric.warn('fabric.TextArea is already defined');
		return;
	}

	var splitter = new GraphemeSplitter(),
		clone = fabric.util.object.clone,
		multiplyTransformMatrices = fabric.util.multiplyTransformMatrices;
	fabric.TextArea = fabric.util.createClass(fabric.Textbox, {
		type: 'textArea',
		initialize: function (text, options) {
			if (options.width) {
				options.dynamicMinWidth = options.width;
			}
			this.callSuper('initialize', text, options);
			var updateErrors = this.updateErrors.bind(this),
				me = this;
			this.on('moving', updateErrors);
			this.on('moved', updateErrors);
			this.on('rotating', updateErrors);
			this.on('rotated', updateErrors);
			this.on('scaling', updateErrors);
			this.on('scaled', updateErrors);
			this.on('deselected', function () {
				me.setActiveError(null);
			});
			this.on('removed', function () {
				me.setErrors([]);
			});
		},
		_wordcutter: function (word, lineIndex, desiredWidth, offset) {
			var width = 0, prevGrapheme, skipLeft = true, parts = [], part = [],
				additionalSpace = this._getWidthOfCharSpacing();
			for (var i = 0, len = word.length; i < len; i++) {
				var box = this._getGraphemeBox(word[i], lineIndex, i + offset, prevGrapheme, skipLeft);
				prevGrapheme = word[i];
				width += box.width;
				if (desiredWidth > (width + additionalSpace)) {
					part.push(prevGrapheme);
				} else {
					parts.push(part);
					width = box.width;
					part = [prevGrapheme];
				}
			}
			parts.push(part);
			return parts;
		},
		getWords: function (_line, lineIndex, desiredWidth) {
			var words = [],
				me = this,
				offset = 0;
			_line.split(this._wordJoiners).forEach(word => {
				var parts = me._wordcutter(word, lineIndex, desiredWidth, offset)
				parts.forEach(function (e) {
					offset += e.length;
				});
				words.push(parts);
				offset++;
			});
			return words;
		},
		splitByGrapheme: true,
		_wrapLine: function (_line, lineIndex, desiredWidth, reservedSpace) {
			if (!this.splitByGrapheme) {
				return this.callSuper('_wrapLine', _line, lineIndex, desiredWidth, reservedSpace);
			}
			var lineWidth = 0,
				graphemeLines = [],
				line = [],
				words = this.getWords(_line, lineIndex, desiredWidth),
				word = '',
				offset = 0,
				wordWidth = 0,
				lineJustStarted = true,
				additionalSpace = this._getWidthOfCharSpacing(),
				reservedSpace = reservedSpace || 0;
			if (words.length === 0) {
				words.push([]);
			}
			desiredWidth -= reservedSpace;
			for (var i = 0; i < words.length; i++) {
				word = words[i];
				if (i !== words.length - 1) {
					word[word.length - 1].push(' ');
				}
				for (var j = 0; j < word.length; j++) {
					var wordPart = word[j];
					wordWidth = this._measureWord(wordPart, lineIndex, offset);
					offset += wordPart.length;

					lineWidth += wordWidth - additionalSpace;
					if (lineWidth > desiredWidth && !lineJustStarted) {
						graphemeLines.push(line);
						line = [];
						lineWidth = wordWidth;
						lineJustStarted = true;
					}
					else {
						lineWidth += additionalSpace;
					}

					line = line.concat(wordPart);
					offset++;
					lineJustStarted = false;
				}
			}
			i && graphemeLines.push(line);
			return graphemeLines;
		},
		renderCursor: function (boundaries, ctx) {
			var cursorLocation = this.get2DCursorLocation(),
				lineIndex = cursorLocation.lineIndex,
				charIndex = cursorLocation.charIndex > 0 ? cursorLocation.charIndex - 1 : 0,
				charHeight = this.getValueOfPropertyAt(lineIndex, charIndex, 'fontSize'),
				multiplier = this.scaleX * this.canvas.getZoom(),
				cursorWidth = this.cursorWidth / multiplier,
				topOffset = boundaries.topOffset,
				dy = this.getValueOfPropertyAt(lineIndex, charIndex, 'deltaY');

			topOffset += (1 - this._fontSizeFraction) * this.getHeightOfLine(lineIndex) / this.lineHeight
				- charHeight * (1 - this._fontSizeFraction);

			if (this.inCompositionMode) {
				this.renderSelection(boundaries, ctx);
			}

			ctx.fillStyle = this.cursorColor || this.getCursorColor();
			ctx.globalAlpha = this.__isMousedown ? 1 : this._currentCursorOpacity;
			ctx.fillRect(
				boundaries.left + boundaries.leftOffset - cursorWidth / 2,
				topOffset + boundaries.top + dy,
				cursorWidth,
				charHeight);
		},
		getCursorColor: function () {
			if (this.styleCache && this.styleCache.style) {
				return this.styleCache.style.fill || '#000';
			}
			return '#000';
		},
		renderCursorOrSelection: function () {
			if (!this.isEditing || !this.canvas || !this.canvas.contextTop) {
				return;
			}
			var boundaries = this._getCursorBoundaries(),
				ctx = this.canvas.contextTop;
			this.clearContextTop(true);
			if (this.selectionStart === this.selectionEnd) {
				this.renderCursor(boundaries, ctx);
			}
			else {
				this.renderSelection(boundaries, ctx);
			}
			this.canvas && this.canvas.fire('text:selection:ended', { target: this });
			ctx.restore();
		},
		insertCharStyleObject: function (lineIndex, charIndex, quantity, copiedStyle) {
			if (!this.styles) {
				this.styles = {};
			}
			var currentLineStyles = this.styles[lineIndex],
				currentLineStylesCloned = currentLineStyles ? clone(currentLineStyles) : {};

			quantity || (quantity = 1);
			for (var index in currentLineStylesCloned) {
				var numericIndex = parseInt(index, 10);
				if (numericIndex >= charIndex) {
					currentLineStyles[numericIndex + quantity] = currentLineStylesCloned[numericIndex];
					if (!currentLineStylesCloned[numericIndex - quantity]) {
						delete currentLineStyles[numericIndex];
					}
				}
			}
			this._forceClearCache = true;
			if (copiedStyle) {
				while (quantity--) {
					if (!Object.keys(copiedStyle[quantity]).length) {
						continue;
					}
					if (!this.styles[lineIndex]) {
						this.styles[lineIndex] = {};
					}
					this.styles[lineIndex][charIndex + quantity] = clone(copiedStyle[quantity]);
				}
				return;
			}
			if (!currentLineStyles) {
				return;
			}
			var style;
			if (this.styleCache && this.styleCache.key === this.selectionStart) {
				style = this.styleCache.style;
			}
			var newStyle = style || currentLineStyles[charIndex ? charIndex - 1 : 1];
			while (newStyle && quantity--) {
				this.styles[lineIndex][charIndex + quantity] = clone(newStyle);
			}
		},
		get2DCursorLocation: function (selectionStart, skipWrapping) {
			if (typeof selectionStart === 'undefined') {
				selectionStart = this.selectionStart;
			}
			var lines = skipWrapping ? this._unwrappedTextLines : this._textLines,
				len = lines.length,
				offset;
			for (var i = 0; i < len; i++) {
				if (selectionStart <= lines[i].length) {
					return {
						lineIndex: i,
						charIndex: selectionStart
					};
				}
				offset = skipWrapping ? 1 : this.missingNewlineOffset(i);
				selectionStart -= lines[i].length + offset;
			}
			return {
				lineIndex: i - 1,
				charIndex: lines[i - 1].length < selectionStart ? lines[i - 1].length : selectionStart
			};
		},
		_measureLine: function (lineIndex) {
			var width = 0, i = 0, j, grapheme, line = this._textLines[lineIndex], prevGrapheme,
				graphemeInfo, numOfSpaces = 0, lineBounds = new Array(line.length),
				positionInPath = 0, startingPoint, totalPathLength, path = this.path;

			this.__charBounds[lineIndex] = lineBounds;
			if (path) {
				startingPoint = fabric.util.getPointOnPath(path.path, 0, path.segmentsInfo);
				totalPathLength = path.segmentsInfo[path.segmentsInfo.length - 1].length;
				startingPoint.x += path.pathOffset.x;
				startingPoint.y += path.pathOffset.y;
			}

			var graphemes = splitter.splitGraphemes(line.join(''));
			for (j = 0; j < graphemes.length; j++) {
				grapheme = graphemes[j];
				graphemeInfo = this._getGraphemeBox(grapheme, lineIndex, i, prevGrapheme);
				if (path) {
					if (positionInPath > totalPathLength) {
						positionInPath %= totalPathLength;
					}
					this._setGraphemeOnPath(positionInPath, graphemeInfo, startingPoint);
				}

				for (var x = 0, len = grapheme.split('').length; x < len; ++i, ++x) {
					lineBounds[i] = Object.assign({ graphemeIdx: j }, graphemeInfo);
				}

				width += graphemeInfo.kernedWidth;
				positionInPath += graphemeInfo.kernedWidth;
				prevGrapheme = grapheme;
			}
			lineBounds[i] = {
				left: graphemeInfo ? graphemeInfo.left + graphemeInfo.width : 0,
				width: 0,
				kernedWidth: 0,
				height: this.fontSize,
				graphemeIdx: j
			};
			return { width: width, numOfSpaces: numOfSpaces };
		},
		getSelectionStartFromPointer: function (e) {
			var mouseOffset = this.getLocalPointer(e),
				prevWidth = 0,
				width = 0,
				height = 0,
				charIndex = 0,
				lineIndex = 0,
				lineLeftOffset,
				line;

			for (var i = 0, len = this._textLines.length; i < len; i++) {
				if (height <= mouseOffset.y) {
					height += this.getHeightOfLine(i) * this.scaleY;
					lineIndex = i;
					if (i > 0) {
						charIndex += this._textLines[i - 1].length + this.missingNewlineOffset(i - 1);
					}
				}
				else {
					break;
				}
			}
			lineLeftOffset = this._getLineLeftOffset(lineIndex);
			width = lineLeftOffset * this.scaleX;
			line = this._textLines[lineIndex];
			var idx = -1;
			for (var j = 0, jlen = line.length; j < jlen; j++) {
				prevWidth = width;
				var data = this.__charBounds[lineIndex][j];
				if (data.graphemeIdx !== idx) {
					width += data.kernedWidth * this.scaleX;
					idx = data.graphemeIdx;
				}
				if (width <= mouseOffset.x) {
					charIndex++;
				}
				else {
					break;
				}
			}
			return this._getNewSelectionStartFromOffset(mouseOffset, prevWidth, width, charIndex, jlen);
		},
		_renderChars: function (method, ctx, line, left, top, lineIndex) {
			var lineHeight = this.getHeightOfLine(lineIndex),
				isJustify = this.textAlign.indexOf('justify') !== -1,
				actualStyle,
				nextStyle,
				charsToRender = '',
				charBox,
				boxWidth = 0,
				timeToRender,
				path = this.path,
				shortCut = !isJustify && this.charSpacing === 0 && this.isEmptyStyles(lineIndex) && !path;

			ctx.save();
			top -= lineHeight * this._fontSizeFraction / this.lineHeight;
			if (shortCut) {
				this._renderChar(method, ctx, lineIndex, 0, line.join(''), left, top, lineHeight);
				ctx.restore();
				return;
			}

			var graphemeIdx = -1;
			for (var i = 0, len = line.length - 1; i <= len; i++) {
				timeToRender = i === len || this.charSpacing || path;
				charsToRender += line[i];
				charBox = this.__charBounds[lineIndex][i];
				if (boxWidth === 0) {
					left += charBox.kernedWidth - charBox.width;
					boxWidth += charBox.width;
				} else if (graphemeIdx !== charBox.graphemeIdx) {
					boxWidth += charBox.kernedWidth;
				}

				graphemeIdx = charBox.graphemeIdx;

				if (isJustify && !timeToRender) {
					if (this._reSpaceAndTab.test(line[i])) {
						timeToRender = true;
					}
				}
				if (!timeToRender) {
					actualStyle = actualStyle || this.getCompleteStyleDeclaration(lineIndex, i);
					nextStyle = this.getCompleteStyleDeclaration(lineIndex, i + 1);
					timeToRender = this._hasStyleChanged(actualStyle, nextStyle);
				}
				if (timeToRender) {
					if (path) {
						ctx.save();
						ctx.translate(charBox.renderLeft, charBox.renderTop);
						ctx.rotate(charBox.angle);
						this._renderChar(method, ctx, lineIndex, i, charsToRender, -boxWidth / 2, 0, lineHeight);
						ctx.restore();
					}
					else {
						this._renderChar(method, ctx, lineIndex, i, charsToRender, left, top, lineHeight);
					}
					charsToRender = '';
					actualStyle = nextStyle;
					left += boxWidth;
					boxWidth = 0;
				}
			}
			ctx.restore();
		},
		_setSVGTextLineText: function (textSpans, lineIndex, textLeftOffset, textTopOffset) {
			var lineHeight = this.getHeightOfLine(lineIndex),
				isJustify = this.textAlign.indexOf('justify') !== -1,
				actualStyle,
				nextStyle,
				charsToRender = '',
				charBox, style,
				boxWidth = 0,
				line = this._textLines[lineIndex],
				timeToRender;

			textTopOffset += lineHeight * (1 - this._fontSizeFraction) / this.lineHeight;

			var graphemeIdx = -1;
			for (var i = 0, len = line.length - 1; i <= len; i++) {
				timeToRender = i === len || this.charSpacing;
				charsToRender += line[i];
				charBox = this.__charBounds[lineIndex][i];
				if (boxWidth === 0) {
					textLeftOffset += charBox.kernedWidth - charBox.width;
					boxWidth += charBox.width;
				} else if (graphemeIdx !== charBox.graphemeIdx) {
					boxWidth += charBox.kernedWidth;
				}

				graphemeIdx = charBox.graphemeIdx;

				if (isJustify && !timeToRender) {
					if (this._reSpaceAndTab.test(line[i])) {
						timeToRender = true;
					}
				}
				if (!timeToRender) {
					actualStyle = actualStyle || this.getCompleteStyleDeclaration(lineIndex, i);
					nextStyle = this.getCompleteStyleDeclaration(lineIndex, i + 1);
					timeToRender = this._hasStyleChangedForSvg(actualStyle, nextStyle);
				}
				if (timeToRender) {
					style = this._getStyleDeclaration(lineIndex, i) || {};
					textSpans.push(this._createTextCharSpan(charsToRender, style, textLeftOffset, textTopOffset));
					charsToRender = '';
					actualStyle = nextStyle;
					textLeftOffset += boxWidth;
					boxWidth = 0;
				}
			}
		},
		_wrapSVGTextAndBg: function (textAndBg) {
			var noShadow = true;
			return [
				textAndBg.textBgRects.join(''),
				'\t\t<text xml:space="preserve" ',
				(this.fontFamily ? 'font-family="' + this.fontFamily.replace(/"/g, '\'') + '" ' : ''),
				(this.fontSize ? 'font-size="' + this.fontSize + '" ' : ''),
				(this.fontStyle ? 'font-style="' + this.fontStyle + '" ' : ''),
				(this.fontWeight ? 'font-weight="' + this.fontWeight + '" ' : ''),
				'style="', this.getSvgStyles(noShadow), '"', this.addPaintOrder(), ' >',
				textAndBg.textSpans.join(''),
				'</text>\n'
			];
		},
		_setSVGTextLineText: function (textSpans, lineIndex, textLeftOffset, textTopOffset) {
			var lineHeight = this.getHeightOfLine(lineIndex),
				isJustify = this.textAlign.indexOf('justify') !== -1,
				actualStyle,
				nextStyle,
				charsToRender = '',
				charBox, style,
				boxWidth = 0,
				line = this._textLines[lineIndex],
				timeToRender;

			textTopOffset += lineHeight * (1 - this._fontSizeFraction) / this.lineHeight;
			for (var i = 0, len = line.length - 1; i <= len; i++) {
				timeToRender = i === len || this.charSpacing;
				charsToRender += line[i];
				charBox = this.__charBounds[lineIndex][i];
				if (boxWidth === 0) {
					textLeftOffset += charBox.kernedWidth - charBox.width;
					boxWidth += charBox.width;
				}
				else {
					boxWidth += charBox.kernedWidth;
				}
				if (isJustify && !timeToRender) {
					if (this._reSpaceAndTab.test(line[i])) {
						timeToRender = true;
					}
				}
				if (!timeToRender) {
					actualStyle = actualStyle || this.getCompleteStyleDeclaration(lineIndex, i);
					nextStyle = this.getCompleteStyleDeclaration(lineIndex, i + 1);
					timeToRender = this._hasStyleChangedForSvg(actualStyle, nextStyle);
				}
				if (timeToRender) {
					style = this._getStyleDeclaration(lineIndex, i) || {};
					var textDecoration = this.getSvgTextDecoration(this);
					if (textDecoration) {
						var tmp = {};
						Object.assign(tmp, style);
						tmp[textDecoration] = true;
						style = tmp;
					}
					textSpans.push(this._createTextCharSpan(charsToRender, style, textLeftOffset, textTopOffset));
					charsToRender = '';
					actualStyle = nextStyle;
					textLeftOffset += boxWidth;
					boxWidth = 0;
				}
			}
		},
		_renderTextDecoration: function (ctx, type) {
			if (!this[type] && !this.styleHas(type)) {
				return;
			}
			var heightOfLine, size, _size,
				lineLeftOffset, dy, _dy,
				line, lastDecoration,
				leftOffset = this._getLeftOffset(),
				topOffset = this._getTopOffset(), top,
				boxStart, boxWidth, charBox, currentDecoration,
				maxHeight, currentFill, lastFill, path = this.path,
				charSpacing = this._getWidthOfCharSpacing();

			for (var i = 0, len = this._textLines.length; i < len; i++) {
				heightOfLine = this.getHeightOfLine(i);
				if (!this[type] && !this.styleHas(type, i)) {
					topOffset += heightOfLine;
					continue;
				}
				line = this._textLines[i];
				maxHeight = heightOfLine / this.lineHeight;
				lineLeftOffset = this._getLineLeftOffset(i);
				boxStart = 0;
				boxWidth = 0;
				lastDecoration = this.getValueOfPropertyAt(i, 0, type);
				lastFill = this.getValueOfPropertyAt(i, 0, 'fill');
				top = topOffset + maxHeight * (1 - this._fontSizeFraction);
				size = this.getHeightOfChar(i, 0);
				dy = this.getValueOfPropertyAt(i, 0, 'deltaY');

				var graphemeIdx = -1;
				for (var j = 0, jlen = line.length; j < jlen; j++) {
					charBox = this.__charBounds[i][j];
					currentDecoration = this.getValueOfPropertyAt(i, j, type);
					currentFill = this.getValueOfPropertyAt(i, j, 'fill');
					_size = this.getHeightOfChar(i, j);
					_dy = this.getValueOfPropertyAt(i, j, 'deltaY');
					if (path && currentDecoration && currentFill) {
						ctx.save();
						ctx.fillStyle = lastFill;
						ctx.translate(charBox.renderLeft, charBox.renderTop);
						ctx.rotate(charBox.angle);
						ctx.fillRect(
							-charBox.kernedWidth / 2,
							this.offsets[type] * _size + _dy,
							charBox.kernedWidth,
							this.fontSize / 15
						);
						ctx.restore();
					}
					else if (
						(currentDecoration !== lastDecoration || currentFill !== lastFill || _size !== size || _dy !== dy)
						&& boxWidth > 0
					) {
						if (lastDecoration && lastFill) {
							ctx.fillStyle = lastFill;
							ctx.fillRect(
								leftOffset + lineLeftOffset + boxStart,
								top + this.offsets[type] * size + dy,
								boxWidth,
								this.fontSize / 15
							);
						}
						boxStart = charBox.left;
						boxWidth = charBox.width;
						lastDecoration = currentDecoration;
						lastFill = currentFill;
						size = _size;
						dy = _dy;
					} else if (graphemeIdx !== charBox.graphemeIdx) {
						boxWidth += charBox.kernedWidth;
					}
					graphemeIdx = charBox.graphemeIdx;
				}
				ctx.fillStyle = currentFill;
				currentDecoration && currentFill && ctx.fillRect(
					leftOffset + lineLeftOffset + boxStart,
					top + this.offsets[type] * size + dy,
					boxWidth - charSpacing,
					this.fontSize / 15
				);
				topOffset += heightOfLine;
			}
			this._removeShadow(ctx);
		},
		toObject: function (propertiesToInclude) {
			var additionalProperties = [
				'allowedLeft',
				'allowedTop'
			].concat(propertiesToInclude),
				obj = this.callSuper('toObject', additionalProperties);
			if (this.isEditing) {
				delete obj.selectable;
				delete obj.evented;
				delete obj.hasControls;
				delete obj.lockMovementX;
				delete obj.lockMovementY;
			}
			return obj;
		},
		initHiddenTextarea: function () {
			this.callSuper('initHiddenTextarea');
			if (this.enableTransliteration) {
				var me = this,
					hiddenTextarea = this.hiddenTextarea,
					ctn = window.enableTransliteration(hiddenTextarea, 'ne'),
					cb = ctn.suggestionBox.endSuggestions;
				ctn.suggestionBox.endSuggestions = function () {
					cb.call(this);
					me.onInput({
						inputType: 'insertFromPaste',
						stopPropagation: function () { }
					})
				}
			}
		},
		_checkGrammar: async function () {
			if (this.checkingGrammer) {
				return;
			}
			var raw = JSON.stringify({
				text: this.text,
				language: "en-US",
				ai: true,
				key: "eMqCL9qAWgLfXFNm",
				poweredBy: "textgears-api"
			});

			var requestOptions = {
				method: "POST",
				body: raw,
				redirect: "follow"
			};
			var cnt = this.canvas.wrapperEl;
			var el = fabric.document.createElement('div');
			el.classList.add("spinner");
			el.appendChild(fabric.document.createElement('div'));
			cnt.appendChild(el);

			var m = multiplyTransformMatrices(this.getViewportTransform(), this.calcOwnMatrix());
			m[4] -= this.width / 2;
			m[5] -= this.height / 2;
			el.style.transform = "matrix(" + m.join() + ")";
			el.style.width = this.width + "px";
			el.style.height = this.height + "px";
			this.checkingGrammer = true;
			try {
				var response = await fetch("https://sg.api.textgears.com/analyze", requestOptions),
					json = JSON.parse(await response.text());
				this.setErrors(json.response.grammar.errors);
			} catch (err) {
				console.error(err);
			} finally {
				el.remove();
				delete this.checkingGrammer;
			}
		},
		errors: [],
		setErrors: function (err) {
			var cnt = this.canvas.wrapperEl,
				me = this;
			this.errors.forEach(function (e) {
				cnt.removeChild(e.el);
			});
			this.errors = err.map(function (e) {
				var el = fabric.document.createElement('div');
				el.classList.add("textAreaError");
				el.addEventListener("click", function (event) {
					me.onErrorAction(event, e);
				});
				cnt.appendChild(el);
				e.el = el;
				return e;
			});
			this.updateErrors();
		},
		onErrorAction: function (event, error) {
			var me = this,
				target = event.target,
				dropdown = fabric.document.createElement('div'),
				select = fabric.document.createElement('ul');
			dropdown.onclick = function (e) {
				e.stopPropagation();
			}
			target.appendChild(dropdown);
			dropdown.classList.add("dropdown");
			dropdown.classList.add(error.type);

			var errorType = fabric.document.createElement('div');
			errorType.classList.add("type");
			errorType.innerHTML = error.type + " error";
			dropdown.appendChild(errorType);

			dropdown.appendChild(select);

			error.better.forEach(function (val) {
				var option = fabric.document.createElement('div');
				option.classList.add("option");
				option.innerHTML = val;
				option.addEventListener("click", function () {
					me.onSuggestionClick(error, val);
				});
				select.appendChild(option);
			});
			this.setActiveError(error);
		},
		setActiveError: function (error) {
			if (this.activeError) {
				this.activeError.el.innerHTML = '';
				this.activeError.el.style.zIndex = 1;
			}
			if (error) {
				error.el.style.zIndex = 2;
			}
			this.activeError = error;
		},
		onSuggestionClick: function (error, val) {
			var preText = this.text.substring(0, error.offset),
				text = preText + val + this.text.substring(error.offset + error.length, this.text.length),
				errors = [],
				diff = val.length - error.length;
			error.el.remove();
			for (var err of this.errors) {
				if (err.offset < error.offset) {
					errors.push(err);
				} else if (err.offset > error.offset) {
					err.offset += diff;
					errors.push(err);
				}
			}
			this.errors = errors;
			this.set({ text });

			var preText = preText.split('\n'),
				lineIdx = preText.length - 1,
				charIdx = preText[lineIdx].length,
				lineStyles = this.styles[lineIdx] || {},
				preStyleLen = Math.max(0, ...Object.keys(lineStyles).map(i => Number(i))) + 1,
				newLineStyle = {},
				i = 0, j = 0;
			for (; i < charIdx; ++i) {
				if (lineStyles[i]) {
					newLineStyle[i] = lineStyles[i];
				}
			}
			var targetStyle = lineStyles[i];
			for (; j < val.length; ++j) {
				if (targetStyle) {
					newLineStyle[i + j] = Object.assign({}, targetStyle);
				}
			}
			j = j + i;
			for (i += error.length; i < preStyleLen; ++i, ++j) {
				if (lineStyles[i]) {
					newLineStyle[j] = lineStyles[i];
				}
			}

			this.styles[lineIdx] = newLineStyle;
			this.calcTextWidth();
			this.updateErrors();
			this.canvas.renderAll();
		},
		updateErrors: function () {
			var me = this,
				vpt = this.getViewportTransform(),
				m = multiplyTransformMatrices(vpt, this.calcOwnMatrix()),
				origin = {
					left: m[4],
					top: m[5]
				},
				charBounds = this.__charBounds,
				tmp = 0,
				tops = [0];
			charBounds.forEach(function (e, i) {
				tmp += me.getHeightOfLine(i);
				tops.push(tmp);
			});

			var fontFactor = this.lineHeight * this._fontSizeMult;
			this.errors.forEach(function (e, i) {
				var el = e.el,
					start = me.getCharPosition(e.offset),
					end = me.getCharPosition(e.offset + e.length - 1),
					startCharBounds = charBounds[start.lineIndex][start.charIndex],
					endCharBounds = charBounds[end.lineIndex][end.charIndex];
				var width = endCharBounds.left - startCharBounds.left + endCharBounds.width,
					height = startCharBounds.height,
					top = me._getTopOffset() + height / 2,
					left = me._getLeftOffset() + width / 2;
				m[4] = origin.left - width / 2;
				m[5] = origin.top - height / 2;

				var mat = multiplyTransformMatrices(
					m,
					[
						1, 0, 0, 1,
						startCharBounds.left + left,
						top + tops[start.lineIndex] + ((tops[start.lineIndex + 1] - tops[start.lineIndex]) / fontFactor - height)
					]
				);
				el.style.transform = "matrix(" + mat.join() + ")";
				el.style.width = width + "px";
				el.style.height = height + "px";
			});
		},
		enterEditing: function (e) {
			this.setErrors([]);
			return this.callSuper("enterEditing", e)
		},
		getCharPosition: function (selectionStart) {
			var lines = this._textLines,
				len = lines.length;
			for (var i = 0; i < len; i++) {
				if (selectionStart < lines[i].length) {
					return {
						lineIndex: i,
						charIndex: selectionStart
					};
				}
				selectionStart -= lines[i].length + this.missingNewlineOffset(i);
			}
			return {
				lineIndex: i - 1,
				charIndex: selectionStart
			};
		},
		onInput: function (e) {
			var res = this.callSuper('onInput', e);
			this.__onInput();
			return res;
		},
		__onInput: function () {
			if (this.maxWarningHeight < this.height) {
				var canvas = this.canvas;
				canvas && canvas.fire('text:limitReached', { target: this });
			}
		}
	});

	fabric.TextArea.fromObject = function (object, callback) {
		return fabric.Object._fromObject('TextArea', object, callback, 'text');
	};
	var updateIcon = new Image(),
		renderIconControl = fabric.controlsUtils.renderIconControl;
	updateIcon.src = '/resources/icons/grammar.png';

	fabric.TextArea.prototype.controls.tl = new fabric.Control({
		x: -0.5,
		y: -0.5,
		cursorStyleHandler: function () {
			return 'pointer';
		},
		getActionName: function () {
			return 'grammarly';
		},
		mouseDownHandler: function (eventData, transform, x, y) {
			var fabricObject = transform.target;
			fabricObject._checkGrammar();
		},
		render: function (ctx, left, top, styleOverride, fabricObject) {
			ctx.save();
			var styleOverrides = {};
			renderIconControl.call(this, ctx, left, top, updateIcon, styleOverrides);
			var style = fabricObject?.inputEl?.style;
			if (style) {
				style.width = styleOverrides.cornerSize + 'px';
				style.height = styleOverrides.cornerSize + 'px';
				style.left = left + 'px';
				style.top = top + 'px';
			}
			ctx.restore();
		}
	});
})(typeof exports !== 'undefined' ? exports : this);


(function (global) {
	'use strict';

	var fabric = global.fabric || (global.fabric = {});

	if (fabric.ImageHolder) {
		fabric.warn('fabric.ImageHolder is already defined');
		return;
	}

	fabric.ImageHolder = fabric.util.createClass(fabric.Image, {
		type: 'imageHolder',
		src: '/template/images/placeholder.png',
		getSvgSrc: function () {
			return "[~" + this.id + "~]";
		},
		getSvgThumbSrc: function () {
			return "[~" + this.id + "~]";
		}
	});

	fabric.ImageHolder.fromObject = function (_object, callback) {
		var object = fabric.util.object.clone(_object);
		fabric.util.loadImage(object.src, function (img, isError) {
			if (isError) {
				callback && callback(null, true);
				return;
			}
			fabric.Image.prototype._initFilters.call(object, object.filters, function (filters) {
				object.filters = filters || [];
				fabric.Image.prototype._initFilters.call(object, [object.resizeFilter], function (resizeFilters) {
					object.resizeFilter = resizeFilters[0];
					fabric.util.enlivenObjects([object.clipPath], function (enlivedProps) {
						object.clipPath = enlivedProps[0];
						callback(new fabric.ImageHolder(img, object), false);
					});
				});
			});
		}, null, object.crossOrigin);
	};
})(typeof exports !== 'undefined' ? exports : this);