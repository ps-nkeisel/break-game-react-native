import { vec2 } from "gl-matrix";
const PIXI = require("pixi.js");

export default class Fov {

    static epsilon = 0.075;
    static halfAuxRayTilt = 8.72664625995e-3;               // half degree in radians
    static halfAuxRayTiltCos = Math.cos(Fov.halfAuxRayTilt);    // 0.999961923064
    static halfAuxRayTiltSin = Math.sin(Fov.halfAuxRayTilt);    // 8.72653549837e-3

    static personRadius = 5;
    static visionRadius = 140;
    static FoV = 1.25663706143;  // 72° field of vision in radians;
    static halfFoV = Fov.FoV / 2;
    static halfFoVCos = Math.cos(Fov.halfFoV); // 0.809016994375
    static halfFoVSin = Math.sin(Fov.halfFoV); // 0.587785252292

    static wallColour = "105, 105, 105";
    static observerColour = "255, 128, 128";
    static targetColour = "128, 128, 255";
    static targetSeenColour = "255, 0, 255";

    static PointInSector = {
        FrontSemicircle: 0,   // point within sector-containing semicircle
        // but outside sector
        Behind: 1,   // point behind sector
        Outside: 2,   // point outside bounding circle
        Within: 4    // point contained within sector
    };

    static LineSegConfig = {
        Disjoint: 0,
        Parallel: 1,
        Intersect: 2,
    };

    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.debug = false;
        this.scene = {
            polygons: [
                // {
                //     coords: [70, 50, 190, 70, 170, 140, 100, 130],
                //     colour: Fov.wallColour,
                //     stroke: 1,
                //     fill: true
                // },
                // {
                //     coords: [230, 50, 350, 70, 330, 140, 305, 90],
                //     colour: Fov.wallColour,
                //     stroke: 1,
                //     fill: true
                // },
                // {
                //     coords: [475, 56, 475, 360, 616, 360, 616, 56],
                //     colour: Fov.wallColour,
                //     stroke: 1,
                //     fill: true
                // },
                // {
                //     coords: [374, 300, 374, 450],
                //     colour: Fov.wallColour,
                //     stroke: 1,
                //     fill: false
                // },
                // {
                //     coords: [188.57143, 381.89539,
                //         167.824635, 304.467285,
                //         328.25502, 261.480095,
                //         268.205575, 321.529535,
                //         330.053215, 357.237285,
                //         207.155635, 428.19224,
                //         226.618645, 355.55529],
                //     color: Fov.wallColour,
                //     stroke: 1,
                //     fill: true
                // },
                // {
                //     coords: [100, 200, 120, 250, 60, 300],
                //     colour: Fov.wallColour,
                //     stroke: 1,
                //     fill: true
                // },
                // {
                //     coords: [0, 0, 640, 0, 640, 480, 0, 480],
                //     colour: "128, 128, 128",
                //     stroke: 1,
                //     fill: false
                // }
            ],
            observer: [],
            target: {
                loc: vec2.fromValues(293, 100),
                dir: vec2.fromValues(-1, 0),
                colour: Fov.targetColour
            }
        };
    }

    setTargetPosition = (x, y) => {
        this.scene.target.loc = vec2.fromValues(x, y);
        //window.requestAnimationFrame(this.mainLoop);
    }

    clearPolygons = () => {
        this.scene.polygons = [];
    }
    addPolygon = (polygon) => {
        if (polygon === undefined)
            polygon = true;
        
        polygon.enabled = polygon.enabled ?? true;
        polygon.colour = Fov.wallColour;
        polygon.stroke = 1;
        polygon.fill = false;

       

        this.scene.polygons.push(polygon);
        Fov.constructEdges(this.scene.polygons);
        return polygon;
    }


    static isZero(v) {
        return (Math.abs(v[0]) + Math.abs(v[1])) <= Fov.epsilon;
    }
    static cross2d(a, b) {
        return (a[0] * b[1]) - (a[1] * b[0]);
    }
    static perp2d(v, clockwise) {
        clockwise = clockwise || false;
        if (clockwise)
            return vec2.fromValues(v[1], -v[0]);
        return vec2.fromValues(-v[1], v[0]);
    }
    static areParallel(a, b) {
        return (Math.abs(Fov.cross2d(a, b)) <= Fov.epsilon);
    }
    static invLerp(line, point) {
        var t = vec2.create();
        vec2.sub(t, point, line.ends[0]);
        return vec2.dot(t, line.vec) / line.len_2;
    }
    static isPointOnLine(pt, line) {
        var v = vec2.create();
        vec2.sub(v, pt, line.ends[0]);
        return Fov.areParallel(v, line.vec);
    }
    static pointOnLine(line, t) {
        var pt = vec2.create();
        vec2.scaleAndAdd(pt, line.ends[0], line.vec, t);
        return pt;
    }
    static rotateDir(dir, cosA, sinA) {
        // doing it manually instead of using mat2d as these can be reused for
        // rotation in both directions, avoiding their recalculation
        var xC = dir[0] * cosA;
        var yC = dir[1] * cosA;
        var xS = dir[0] * sinA;
        var yS = dir[1] * sinA;
        var rotDir = [vec2.fromValues(xC - yS, xS + yC),
        vec2.fromValues(xC + yS, -xS + yC)];
        return rotDir;
    }

    static setDirection(p, lookAt) {
        var newDir = vec2.create();
        vec2.sub(newDir, lookAt, p.loc);
        if (!Fov.isZero(newDir)) {
            vec2.normalize(newDir, newDir);
            p.dir = newDir;
        }
    }

    static pointSegShortestDistance(line, pt) {
        // computing s is nothing but invLerp; not using it since we need
        // our hands on the vector from the line start to pt, e1ToPt
        var e1ToPt = vec2.create();
        vec2.sub(e1ToPt, pt, line.ends[0]);
        var num = vec2.dot(e1ToPt, line.vec);
        var s = num / line.len_2;
        // if the scalar is going to scale the line vector beyond the
        // line segment's end points, then on of the end points is the
        // closest point; clamp the scalar to an end
        // http://doswa.com/2009/07/13/circle-segment-intersectioncollision.html
        s = (s <= 0) ? 0 : ((s >= 1) ? 1 : s);
        // the closest point = line.ends[0] + (s * line.vec), but we only need
        // the squared distance to closest point from pt and nothing more.
        // e1ToPt − (s * line.vec) would give the vector covering said distance
        // i.e. the perpendicular component of e1ToPt
        var perp = vec2.create();
        vec2.scale(perp, line.vec, s);
        vec2.sub(perp, e1ToPt, perp)
        return vec2.sqrLen(perp);
    }

    static lineSegCircleXsect(line, centre, radius_2) {
        // not using <= since tangents to circle don't really intersect the circle;
        // also such an edge wouldn't affect the field of vision (sector)
        return Fov.pointSegShortestDistance(line, centre) < radius_2;
    }

    static isPointInSector(pt, sector) {
        var v = vec2.create();
        vec2.sub(v, pt, sector.centre);
        var dot = vec2.dot(v, sector.midDir);
        if (dot <= 0)
            return Fov.PointInSector.Behind;

        // point in front and outside the circle
        if ((vec2.sqrLen(v) - sector.radius_2) > Fov.epsilon)
            return Fov.PointInSector.Outside;
        // a point on the bouding circle (not in or out) would be
        // classified based on its presence within the sector's angles
        // i.e. on the sector's arc is Within, elsewhere on the circle is 0
        // as in any point inside the front part of the circle minus sector

        /*
         * We now know that the point is neither behind nor outside the circle; we
         * need to check if it's within the sector i.e. if the vector from the
         * sector centre to pt is, by angle, within the edge vectors of the
         * sector. A method for testing if a point is on a circle's arc and not
         * elsewhere on the circle is presented by David Eberly (Intersection of
         * Linear and Circular Component in 2D; see references of lineSegArcXsect
         * for the link) but the below method is superior since the point neededn't
         * be on the circle's perimeter, it can be anywhere; also it has lesser
         * computatons involved.
         *
         * When a vector X lies, by angle, in between vectors A and B, the sign of
         * cross product of A and X and that of X and B would be the same. If it
         * isn't the signs would differ i.e. if X is beyond A or B, the signs will
         * differ. This method taps the anti-commutative nature of the cross
         * product; the order of the operands determine the sign of the result.
         */

        // point in front and within the sector
        // the check is negative since HTML5 canvas is a right-handed system with
        // the +Z axis going away from the viewer, into the screen. Hence crossing
        // in counter-clockwise from A to B would give a pseudovector that comes
        // out of the screen, towards the viewer, so reverse the check.
        if ((Fov.cross2d(sector.fovEdges[0].vec, v) <= 0) &&
            (Fov.cross2d(v, sector.fovEdges[1].vec) <= 0))
            return Fov.PointInSector.Within;

        // point in front and within the circle, but not the sector
        return Fov.PointInSector.FrontSemicircle;
    }

    static lineSegArcXsect(line, sector) {
        var delta = vec2.create();
        vec2.sub(delta, line.ends[0], sector.centre);
        var b = vec2.dot(line.vec, delta);
        var d_2 = line.len_2;
        var c = vec2.sqrLen(delta) - sector.radius_2;
        var det = (b * b) - (d_2 * c);
        // only interested in a line cutting the circle at two points
        if (det > 0) {
            var det_sqrt = Math.sqrt(det);
            var t, t1, t2;
            if (b >= 0) {
                t = b + det_sqrt;
                t1 = -t / d_2;
                t2 = -c / t;
            }
            else {
                t = det_sqrt - b;
                t1 = c / t;
                t2 = t / d_2;
            }
            var p1, p2, p1InSector, p2InSector;
            var points = [];
            if ((t1 >= 0) && (t1 <= 1)) {
                p1 = Fov.pointOnLine(line, t1);
                p1InSector = Fov.isPointInSector(p1, sector);
                if (p1InSector === Fov.PointInSector.Within)
                    points.push(p1);
            }
            if ((t2 >= 0) && (t2 <= 1)) {
                p2 = Fov.pointOnLine(line, t2);
                p2InSector = Fov.isPointInSector(p2, sector);
                if (p2InSector === Fov.PointInSector.Within)
                    points.push(p2);
            }
            // line segment is contained within circle; it may be cutting
            // the sector, but not the arc, so return false, as there're
            // no angle points
            if (p1 === undefined && p2 === undefined)
                return;
            // both intersection points are behind, the edge has no way of cutting
            // the sector
            if ((p1InSector === Fov.PointInSector.Behind) &&
                (p2InSector === Fov.PointInSector.Behind))
                return { config: Fov.PointInSector.Behind };
            // don't return Behind when one of them is undefined and Behind, as one
            // of the endpoints may be in the front semicircle blocking vision

            // if any point was within, points should have atleast one element
            if (points.length)
                return { config: Fov.PointInSector.Within, points: points };
        }
        // line doesn't cut or is tangential
    }

    static lineSegLineSegXsect(line1, line2, shouldComputePoint, isLine1Ray) {
        shouldComputePoint = shouldComputePoint || false;
        isLine1Ray = isLine1Ray || false;
        var result = { config: Fov.LineSegConfig.Disjoint };
        var l1p = Fov.perp2d(line1.vec);
        var f = vec2.dot(line2.vec, l1p);
        if (Math.abs(f) <= Fov.epsilon) {
            result.config = Fov.LineSegConfig.Parallel;
            /*
             * below check is needed if edges can exist on their own, without being
             * part of a polygon; if edges are always part of a polygon, when a ray
             * is shot to a blocking edge's end point (angle point) and if the edge
             * is parallel to the ray then this function's result will be ignored
             * by a caller that checks only for the intersecting case; however,
             * another edge of the polygon with the same angle point as one of its
             * end point would be deemed intersecting and the resulting point would
             * become the hit point. This wouldn't happen if edges can exist on
             * their own, independant of a polygon. With the below block, even for
             * such an independant, parallel edge, the result would contain a
             * parameter t and an intersection point that can be checked by the
             * caller.
             */

            // if line1 is a ray and an intersection point is needed, then filter
            // cases where line and ray are parallel, but the line isn't part of
            // ray e.g. ---> ____ should be filterd, but ---> ----- should not be.
            if (isLine1Ray && shouldComputePoint &&
                Fov.isPointOnLine(line2.ends[0], line1)) {
                // find the ray origin position w.r.t the line segment
                var alpha = Fov.invLerp(line2, line1.ends[0]);
                // ray is originating within the segment
                if ((alpha >= 0) && (alpha <= 1)) {
                    result.t = 0;
                    result.point = vec2.create();
                    vec2.copy(result.point, line1.ends[0]);
                }
                // the ray can see the line i.e. ray origin before segment start
                else if (alpha < 0) {
                    result.point = vec2.create();
                    vec2.copy(result.point, line2.ends[0]);
                    result.t = Fov.invLerp(line1, result.point);
                }
                // else alpha > 1, the segment is behind the ray
            }
        }
        else {
            var c = vec2.create();
            vec2.sub(c, line1.ends[0], line2.ends[0]);
            var e = vec2.dot(c, l1p);
            // t = e ÷ f, but computing t isn't necessary, just checking the values
            // of e and f we deduce if t ∈ [0, 1], if not the division and further
            // calculations are avoided: Antonio's optimisation.
            // f should never be zero here which means they're parallel
            if (((f > 0) && (e >= 0) && (e <= f)) ||
                ((f < 0) && (e <= 0) && (e >= f))) {
                var l2p = Fov.perp2d(line2.vec);
                var d = vec2.dot(c, l2p);
                // if line 1 is a ray, checks relevant to restricting s to 1
                // isn't needed, just check if it wouldn't become < 0
                if ((isLine1Ray && (((f > 0) && (d >= 0)) ||
                    ((f < 0) && (d <= 0)))) ||
                    (((f > 0) && (d >= 0) && (d <= f)) ||
                        ((f < 0) && (d <= 0) && (d >= f)))) {
                    result.config = Fov.LineSegConfig.Intersect;
                    if (shouldComputePoint) {
                        var s = d / f;
                        result.t = s;
                        result.point = Fov.pointOnLine(line1, s);
                    }
                }
            }
        }
        return result;
    }

    static addAnglePointWithAux(point, prevEdge, nextEdge, sector, anglePoints) {
        var currentSize = anglePoints.size;
        anglePoints.add(point);
        // Add aux points only if the addition of the primary point was successful.
        // When a corner vertex of a polygon is added twice for edges A and B,
        // although the primary point would not be added since constructEdges would
        // have used the same vec2 object to make the end points of both edges,
        // this isn't case for the auxiliary points created in this function afresh
        // on each call. This check avoids redundant auxiliary point addition.
        if (currentSize !== anglePoints.size) {
            var ray = vec2.create();
            vec2.sub(ray, point, sector.centre);
            var auxiliaries = Fov.rotateDir(ray, Fov.halfAuxRayTiltCos, Fov.halfAuxRayTiltSin);
            vec2.add(auxiliaries[0], sector.centre, auxiliaries[0]);
            vec2.add(auxiliaries[1], sector.centre, auxiliaries[1]);
            var projAxis = Fov.perp2d(ray);
            // special case polygons with a single edge i.e. an independant wall
            if ((nextEdge === undefined) || (nextEdge === prevEdge)) {
                // lineVec should originate from the added endpoint going to the
                // other end; if added point is second in edge, flip edge's vector
                var lineVec = (point === prevEdge.ends[0]) ? prevEdge.vec :
                    vec2.fromValues(-prevEdge.vec[0], -prevEdge.vec[1]);
                var p = vec2.dot(lineVec, projAxis);
                // if lineVec is in −ve halfspace of projAxis, add the auxiliary
                // ray that would be in the +ve halfspace (i.e. the auxiliary ray
                // due to rotating ray counter-clockwise by iota) and vice-versa
                if (p <= 0)
                    anglePoints.add(auxiliaries[0]);
                // use if instead of else if to deal with the case where ray and
                // edge are parallel, in which case both auxiliary rays are needed
                if (p >= 0)
                    anglePoints.add(auxiliaries[1]);
            }
            else {
                // refer vision_beyond.html workout to understand in which
                // situation vision can extend beyond corners and auxiliary rays
                // are needed
                var p1 = vec2.dot(prevEdge.vec, projAxis);
                var p2 = vec2.dot(nextEdge.vec, projAxis);
                if ((p1 >= 0) && (p2 <= 0))
                    anglePoints.add(auxiliaries[0]);
                else if ((p1 <= 0) && (p2 >= 0))
                    anglePoints.add(auxiliaries[1]);
            }
        }
    }

    static checkPolygon(polygon, sector, anglePoints, blockingEdges) {
        var n = polygon.edges.length;
        var prevEdge = polygon.edges[n - 1];
        for (var i = 0; i < n; ++i) {
            var edge = polygon.edges[i];
            // if this edge intersects the sector's bounding circle do further
            // processing; this rejects any edge not within or cutting the circle.
            if (Fov.lineSegCircleXsect(edge, sector.centre, sector.radius_2)) {
                // deduce the relationship between the points and the sector
                var e1InSector = Fov.isPointInSector(edge.ends[0], sector);
                var e2InSector = Fov.isPointInSector(edge.ends[1], sector);
                // early exit if both points are behind, the edge formed cannot be
                // intersecting the sector
                if ((e1InSector === Fov.PointInSector.Behind) &&
                    (e2InSector === Fov.PointInSector.Behind))
                    continue;

                /*
                 * Vision extends beyond an edge's endpoints (building corners);
                 * see the comment above addAnglePointWithAux for an illustration.
                 * When adding an angle point, if that point was obtained from an
                 * intersection then just adding that point will do since the
                 * observer will not be able to see beyond the edge, while if the
                 * angle point is from an edge's endpoint, then additional
                 * auxiliary angle points are to be added to cover the case where
                 * the observer can see beyond the edge's end. Doing this at a
                 * later stage would be difficult since data on whether the point
                 * was from an edge end or an intersection is lost by then.
                 */

                // both points are inside the sector, add both to anglePoints set
                // and add their edge to the blockingEdges list; don't process
                // further since the edge can't cut the sector's arc, no further
                // angle point due to this edge other than its endpoints
                if ((e1InSector === Fov.PointInSector.Within) &&
                    (e2InSector === Fov.PointInSector.Within)) {
                    Fov.addAnglePointWithAux(edge.ends[0],
                        prevEdge,
                        edge,
                        sector,
                        anglePoints);
                    // for the last edge, send undefined as nextEdge to
                    // addAnglePointWithAux; it should never get used since
                    // both endpoints of the last edge would be handled by now
                    // due to edges 0 and n − 2
                    Fov.addAnglePointWithAux(edge.ends[1],
                        edge,
                        polygon.edges[i + 1],
                        sector,
                        anglePoints);
                    blockingEdges.push(edge);
                }
                else {
                    /*
                     * ANGLE POINTS
                     * Either one or both the points are outside the sector; add
                     * the one which is inside. Perform edge – arc intersection
                     * test, if this edge has a possibility of intersecting the
                     * arc, add resultant intersection point(s) to anglePoints.
                     *
                     * BLOCKING EDGE
                     * If one of the points is inside, then the edge is blocking,
                     * add it without any checks. If one or both are out, and the
                     * edge cuts the sector's arc then too the edge is blocking,
                     * add it to blockingEdges. If both are out and edge doesn't
                     * cut the arc, check if it cuts one of the sector's edges and
                     * add to blockingEdges if it does.
                     */
                    var blocking = false;
                    if (e1InSector === Fov.PointInSector.Within) {
                        Fov.addAnglePointWithAux(edge.ends[0],
                            prevEdge,
                            edge,
                            sector,
                            anglePoints);
                        blocking = true;
                    }
                    if (e2InSector === Fov.PointInSector.Within) {
                        Fov.addAnglePointWithAux(edge.ends[1],
                            edge,
                            polygon.edges[i + 1],
                            sector,
                            anglePoints);
                        blocking = true;
                    }

                    /*
                     * The edge has the possibility of intersecting the sector's
                     * arc only if one of its endpoints is outside the sector's
                     * bounding circle. If one of the points is within sector and
                     * the other is not outside then it cannot be intersecting the
                     * arc. Likewise, if both points are not within the sector,
                     * then both behind case is already pruned, both or one is in
                     * FrontSemicircle and other is behind then too it cannot, in
                     * anyway, be intersecting the arc.
                     */
                    var edgeMayIntersectArc =
                        (e1InSector === Fov.PointInSector.Outside) ||
                        (e2InSector === Fov.PointInSector.Outside);

                    var testSegSegXsect = true;
                    if (edgeMayIntersectArc) {
                        // perform line segment – sector arc intersection test to
                        // check if there're more angle points i.e. if the edge
                        // intersects the sector's arc then the intersection points
                        // would also become angle points.
                        var arcXsectResult = Fov.lineSegArcXsect(edge, sector);
                        if (arcXsectResult) {
                            if (arcXsectResult.config === Fov.PointInSector.Within) {
                                // just add intersection point to Set without any
                                // auxiliarys as it's an intersection angle point
                                var len = arcXsectResult.points.length;
                                for (var j = 0; j < len; ++j)
                                    anglePoints.add(arcXsectResult.points[j]);
                                blocking = true;
                            }
                            // edge – edge intersection test is not needed when the
                            // intersection point(s) are within or behind; the
                            // within case is ignored since it's already blocking
                            // and hence won't reach the lineSegLineSegXsect code
                            testSegSegXsect =
                                (arcXsectResult.config !== Fov.PointInSector.Behind);
                        }
                    }

                    // If there was an angle point added due to this edge, then it
                    // is blocking; add and continue to avoid further processing.
                    if (blocking)
                        blockingEdges.push(edge);

                    /*
                     * If any angle point(s) would occur because of this edge, they
                     * would have been found by now and the edge would have been
                     * tagged as a blocking one. Even if no angle points were found
                     * due to this edge it still may be a blocking, or not. Perform
                     * a couple of segment – segment intersection tests with the
                     * sector's edges to check if the edge is indeed blocking. This
                     * is worth the expenditure incurred; say we have 10 angle
                     * points, for every redundant, non-blocking edge added without
                     * such a check means we waste time in performing 10 futile
                     * line segment intersection tests. Prune them early on by
                     * performing the tests beforehand.
                     *
                     * Perform segment – segment testing if testSegSegXsect is
                     * true; this will be so if the arc intersection was never
                     * performed (say when both points are in FrontSemicircle and
                     * their edge occluding vision) or if the intersection points
                     * aren't behind the sector; there can be cases where not both
                     * points are behind (if so they'd have gotten pruned by now),
                     * but the intersection points are behind, prune them.
                     */
                    else if (testSegSegXsect &&
                        sector.fovEdges.some((sectorEdge) => {
                            return Fov.LineSegConfig.Intersect ===
                                Fov.lineSegLineSegXsect(edge, sectorEdge).config;
                        }))
                        blockingEdges.push(edge);
                }
            }
            prevEdge = edge;
        }
    }

    static makeRays(sector, anglePoints) {
        // first ray needs no check for duplicity; calculate and add to array
        var ray = vec2.create();
        vec2.sub(ray, anglePoints[0], sector.centre);
        var rays = [ray];
        // i for anglePoints, j for rays to avoid doing anglePoints.length - 1
        for (var i = 1, j = 0, n = anglePoints.length; i < n; ++i) {
            ray = vec2.create();
            vec2.sub(ray, anglePoints[i], sector.centre);
            // check if the ray for this angle point is parallel to the previous
            if (!Fov.areParallel(ray, rays[j])) {
                rays.push(ray);
                ++j;
            }
        }
        return rays;
    }

    updateSector = (observer) => {
        if (!observer.sector)
            observer.sector = { centre: null, midDir: null };

        observer.sector.centre = observer.loc;
        observer.sector.midDir = observer.dir;

        var fovDirs = Fov.rotateDir(observer.sector.midDir, Fov.halfFoVCos, Fov.halfFoVSin);
        // make sector edges
        vec2.scale(fovDirs[0], fovDirs[0], observer.sector.radius);
        vec2.scale(fovDirs[1], fovDirs[1], observer.sector.radius);
        var e0 = vec2.create();
        var e1 = vec2.create();
        vec2.add(e0, observer.sector.centre, fovDirs[0]);
        vec2.add(e1, observer.sector.centre, fovDirs[1]);
        var sectorEdges = observer.sector.fovEdges;
        vec2.copy(sectorEdges[0].vec, fovDirs[0]);
        vec2.copy(sectorEdges[0].ends[0], observer.sector.centre);
        vec2.copy(sectorEdges[0].ends[1], e0);
        vec2.copy(sectorEdges[1].vec, fovDirs[1]);
        vec2.copy(sectorEdges[1].ends[0], observer.sector.centre);
        vec2.copy(sectorEdges[1].ends[1], e1);
    }

    static sortAngularPoints(anglePoints, sector) {
        var aV = vec2.create();
        var bV = vec2.create();
        anglePoints.sort((a, b) => {
            vec2.sub(aV, a, sector.centre);
            vec2.sub(bV, b, sector.centre);
            // sort expects a negative value when a should come before b; since
            // cross2d gives a negative value when the rotation from a to b is
            // counter-clockwise we use it as-is; see comment in isPointInSector
            return Fov.cross2d(aV, bV);
        });
    }

    static calcQuadBezCurveCtrlPoint(v1, v2, centre, radius) {
        var ctrlPt = vec2.create();
        // the control point would be on the unit bisector vector, r * (2 − cos ½θ)
        // units far; refer BezierArc/Quadratic workout for the calculation of a
        // quadratic Bézier curve control point that approximates a circle
        vec2.add(ctrlPt, v1, v2);
        vec2.normalize(ctrlPt, ctrlPt);    // unit bisector mid ray
        // the dot product between the mid ray and unitRay would give the cosine of
        // the half angle between v1 and v2
        vec2.scaleAndAdd(ctrlPt,
            centre,
            ctrlPt,
            radius * (2 - vec2.dot(v1, ctrlPt)));
        return ctrlPt;
    }

    static shootRays(rays, blockingEdges, sector) {
        var line1IsRay = true, shouldComputePoint = true;
        var n = rays.length;
        var hitPoints = new Array(n);
        var ctrlPoints = new Array(n);
        // rays is an array of vectors only, however the intersection functions
        // work on edges i.e. it also needs the end points and square length; hence
        // thisRay would act as the ray with additional edge data
        var thisRay = { ends: [sector.centre] }, unitRay = vec2.create();
        // unitRay, prevUnitRay, etc. are temporaries used later; create once, use
        // many, instead of recreating everytime
        var prevPointOnArc = false, prevUnitRay = vec2.create();
        var connector = vec2.create();
        var hitPoint;
        for (var i = 0; i < n; ++i) {
            // set edge data on thisRay specific to the ray currently shot
            thisRay.vec = rays[i];
            thisRay.len_2 = vec2.sqrLen(thisRay.vec);

            hitPoint = hitPoints[i] = vec2.create();
            // without the = undefined these variables would retain their values
            // beyond the current iteration, since JS has no block-scoped variables
            var t = undefined, blocker = undefined, hitDist_2 = undefined;
            for (var j = 0, len = blockingEdges.length; j < len; ++j) {
                var res = Fov.lineSegLineSegXsect(thisRay,
                    blockingEdges[j],
                    shouldComputePoint,
                    line1IsRay);
                // both parallel and intersecting cases are valid for inspection;
                // both have the parameter and point defined
                if ((res.t !== undefined) && ((t === undefined) || (res.t < t))) {
                    // This is needed when the observer is exactly at a polygon's
                    // vertex, from where both worlds (outside and inside the
                    // polygon/building) are visible as the observer is standing at
                    // a pillar point where two walls meet. In such case, all rays
                    // emanating from the centre would hit one of these edges with
                    // t = 0 but this point should be discounted from calculations.
                    // However, the value of t can vary depending on the length of
                    // the ray, hence using the distance between the points as a
                    // better measure of proximity
                    hitDist_2 = vec2.sqrDist(res.point, sector.centre);
                    if (hitDist_2 > Fov.epsilon) {
                        t = res.t;
                        vec2.copy(hitPoint, res.point);
                        blocker = blockingEdges[j];
                    }
                }
            }
            /*
             * the ray could've hit
             *
             *    i. nothing (no blocking edge was in its way; t undefined)
             *   ii. blocking edge(s) of which the closest intersecting point is
             *       a. within the sector
             *       b. on the sector's arc
             *       c. beyond the sector's arc
             *
             * For (ii.c) t may be defined but the point would be beyond the
             * sector's radius. For everything except (ii.a), the hit point would
             * be on the arc and the unit vector along the ray would be needed to
             * draw the Bézier curve, if the next point is also going to be on the
             * arc. For cases (i) and (ii.c), a new hit point needs to be
             * calculated too, which can use the unit vector.
             *
             * One can avoid sqrt and call atan2 to get the angle directly which
             * would also help in drawing the actual arc (using ctx.arc) and not an
             * approximation of the arc using ctx.quadraticCurveTo. However, sqrt
             * is chosen over atan2 since it's usually faster:
             * http://stackoverflow.com/a/9318108.
             */
            var pointOnArc = (t === undefined) ||
                ((hitDist_2 + Fov.epsilon - sector.radius_2) >= 0);
            if (pointOnArc) {
                vec2.normalize(unitRay, thisRay.vec);
                // for cases (i), (ii.b) and (ii.c) set the hit point; this would
                // be redundant for case (ii.b) but checking for it would be
                // cumbersome, so just reassign
                vec2.scaleAndAdd(hitPoint, sector.centre, unitRay, sector.radius);
                if (prevPointOnArc) {
                    var needsArc = true;
                    /*
                     * the case where part of the arc is cut by a blocking edge
                     * needs to be handled differently:
                     *
                     *                     /---  +----------+
                     *                 /---    \-|          |
                     *             /---          X          |
                     *          /--              |\         |
                     *      /---                 | \        |
                     *     o                     |  |       |
                     *      ---\                 | /        |
                     *          --\              |/         |
                     *             ---\          X          |
                     *                 ---\    /-|          |
                     *                     ----  +----------+
                     *
                     * although both hit points would be on the arc, they shouldn't
                     * be connected by an arc since the blocking edge wouldn't
                     * allow vision beyond; hence check if this ray hit a blocking
                     * edge, if yes, then check if it's parallel to the edge formed
                     * by the connection between this and the previous hit points,
                     * if so don't make an arc.
                     */
                    // the check i > 0 isn't needed since if that was the case the
                    // variable prevPointOnArc would be false and the control
                    // would've not reached here, so doing i - 1 is safe here
                    if (blocker) {
                        vec2.sub(connector, hitPoints[i - 1], hitPoint);
                        needsArc = !Fov.areParallel(blocker.vec, connector);
                    }
                    if (needsArc)
                        ctrlPoints[i] = Fov.calcQuadBezCurveCtrlPoint(unitRay,
                            prevUnitRay,
                            sector.centre,
                            sector.radius);
                }
                vec2.copy(prevUnitRay, unitRay);
            }
            prevPointOnArc = pointOnArc;
        }
        return { hitPoints: hitPoints, ctrlPoints: ctrlPoints };
    }

    isSubjectVisible = (blockingEdges, sector) => {
        if (Fov.isPointInSector(this.scene.target.loc, sector) === Fov.PointInSector.Within) {
            var ray = { vec: vec2.create(), ends: [sector.centre] };
            vec2.sub(ray.vec, this.scene.target.loc, sector.centre);
            return !blockingEdges.some((edge) => {
                var res = Fov.lineSegLineSegXsect(ray,
                    edge,
                    true /* shouldComputePoint */);
                if (Fov.LineSegConfig.Intersect === res.config)
                    return vec2.sqrDist(res.point, sector.centre) > Fov.epsilon;
            });
        }
        return false;
    }

    static constructEdges(polygons) {
        for (var i = 0, n = polygons.length; i < n; ++i) {
            var p = polygons[i];
            var pointCount = p.coords.length / 2;
            var points = new Array(pointCount);
            for (var j = 0; j < pointCount; ++j) {
                var idx = j * 2;
                points[j] = vec2.fromValues(p.coords[idx], p.coords[idx + 1]);
            }
            // handle polygons with a single edge i.e. two points
            var edgeCount = (pointCount > 2) ? pointCount : (pointCount - 1);
            var edges = new Array(edgeCount);
            for (var j = 0; j < edgeCount; ++j) {
                var k = (j + 1) % pointCount;
                var v = vec2.create();
                vec2.sub(v, points[k], points[j]);
                edges[j] = {
                    vec: v,
                    len_2: vec2.sqrLen(v),
                    ends: [points[j], points[k]]
                };
            }
            p.edges = edges;
        }
    }

    init2DCanvas = () => {
        try {
            this.canvas = window.document.getElementById("canvas2d"); //document.createElement('canvas');
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.canvas.style = 'display:none;position: fixed;top: 0;right: 0; height: 580px;image-rendering: optimizeSpeed; image-rendering: -moz-crisp-edges; image-rendering: -o-crisp-edges; image-rendering: -webkit-optimize-contrast; image-rendering: optimize-contrast; image-rendering: crisp-edges; image-rendering: pixelated; -ms-interpolation-mode: nearest-neighbor;';



            this.ctx = this.canvas.getContext("2d");
            this.ctx.width = this.canvas.width;
            this.ctx.height = this.canvas.height;
        }
        catch (e) {
            alert("Unable to initialize Canvas. Your browser may not support it.");
        }
    }
    start = () => {
        this.init2DCanvas();
        Fov.constructEdges(this.scene.polygons);


        //window.requestAnimationFrame(this.mainLoop);

    }

    removeAllObservers = () => {
        this.scene.observer = [];
    }

    updateObserver = (observer, x, y, lookAt) => {
        observer.loc = vec2.fromValues(x, y);
        Fov.setDirection(observer, lookAt);
    }

    addObserver = (x, y, lookAt, extraData, coneColour, coneAlpha) => {

        var observerObj = {
            loc: vec2.fromValues(x, y),
            // dir: vec2.fromValues(rotation, rotation * -1),
            colour: Fov.observerColour,
            coneColour: coneColour,
            coneAlpha: coneAlpha,
            extraData: extraData
        };
        Fov.setDirection(observerObj, lookAt);

        var radius_2 = Fov.visionRadius * Fov.visionRadius;

        observerObj.sector = {
            radius: Fov.visionRadius,
            radius_2: radius_2,
            fovEdges: [{
                vec: vec2.create(),
                ends: [vec2.create(),
                vec2.create()],
                len_2: radius_2
            },
            {
                vec: vec2.create(),
                ends: [vec2.create(),
                vec2.create()],
                len_2: radius_2
            }]
        };

        observerObj.fov = {
            blockingEdges: [],
            anglePtSet: new Set(),
            anglePoints: []
        };

        this.scene.observer.push(observerObj);



        return observerObj;
    }



    static getCursorPosition(event, element) {
        var rect = element.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        return vec2.fromValues(x, y);
    }


    mainLoop = () => {
        this.update();
        //this.render();
    }

    update = () => {
        var detected = [];
        this.scene.observer.forEach(observer => {


            var sector = observer.sector;
            this.updateSector(observer);

            var fov = observer.fov;


            var anglePtSet = fov.anglePtSet;
            anglePtSet.clear();
            var blockingEdges = fov.blockingEdges;
            blockingEdges.length = 0;
            for (var i = 0, n = this.scene.polygons.length; i < n; ++i) {
                if (this.scene.polygons[i].enabled === false || this.scene.polygons[i].coords.length === 0) continue;
                
                Fov.checkPolygon(this.scene.polygons[i], sector, anglePtSet, blockingEdges);
            }

            // Spread anglePtSet into an array for sorting. Sector edge end points are
            // also angle points; add them too to their rightful, sorted places so that
            // sorting them doesn't take much time; adding them post sorting needs the
            // points to be pushed and unshifted for the array to remain sorted; avoid
            // this as unshift may be costly. Even if these are collinear to existing
            // angle points, makeRays will remove duplicates from the sorted array.
            var anglePoints = [sector.fovEdges[0].ends[1],
            ...anglePtSet,
            sector.fovEdges[1].ends[1]];
            Fov.sortAngularPoints(anglePoints, sector);
            var rays = Fov.makeRays(sector, anglePoints);
            var result = Fov.shootRays(rays, blockingEdges, sector);
            fov.anglePoints = anglePoints;
            fov.rays = rays;
            fov.hitPoints = result.hitPoints;
            fov.ctrlPoints = result.ctrlPoints;


            if (this.isSubjectVisible(blockingEdges, sector))
                detected.push(observer);

        });
        return { detected: detected.length > 0, detectedObservers: detected };
    }

    render = () => {
        // clear canvas
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.ctx.width, this.ctx.height);

        // draw polygons
        for (var i = 0, n = this.scene.polygons.length; i < n; ++i)
            this.drawPolygon(this.scene.polygons[i]);

        // draw personnel
        this.drawPerson(this.scene.target);

        this.scene.observer.forEach(observer => {



            this.drawPerson(observer);

            var fov = observer.fov;
            var sector = observer.sector;
            this.drawFoV(fov, sector);

            if (this.debug) {
                var radius = Fov.visionRadius;
                var dir = observer.dir;
                var pos = observer.loc;
                // calculate end points by rotating observer.dir
                var rotDir = Fov.rotateDir(dir, Fov.halfFoVCos, Fov.halfFoVSin);
                var e1 = vec2.create();
                vec2.scaleAndAdd(e1, pos, rotDir[0], radius);
                var e2 = vec2.create();
                vec2.scaleAndAdd(e2, pos, rotDir[1], radius);
                var cp = vec2.create();
                vec2.scaleAndAdd(cp, pos, dir, radius * (2 - Fov.halfFoVCos));
                // calculate line perpendicular to observer.dir
                var clockwise = true;
                var p1 = Fov.perp2d(dir, clockwise);
                var p2 = vec2.create();
                vec2.negate(p2, p1);
                vec2.scaleAndAdd(p1, pos, p1, radius);
                vec2.scaleAndAdd(p2, p1, p2, radius * 2);

                this.ctx.beginPath();
                // draw perpendicular
                this.ctx.moveTo(p1[0], p1[1]);
                this.ctx.lineTo(p2[0], p2[1]);
                // draw sector
                this.ctx.moveTo(pos[0], pos[1]);
                this.ctx.lineTo(e1[0], e1[1]);
                this.ctx.quadraticCurveTo(cp[0], cp[1], e2[0], e2[1]);
                this.ctx.closePath();
                this.ctx.stroke();

                // black angle points
                if (fov.anglePoints) {
                    fov.anglePoints.forEach((p, _, set) => {
                        this.drawCircle(p[0], p[1], 3, "0, 0, 0");
                    });
                }
                // black blocking edges
                for (var i = 0, n = fov.blockingEdges.length; i < n; ++i) {
                    this.drawLine(fov.blockingEdges[i], 2, "0, 0, 0");
                }
                // gray rays
                var r = {
                    ends: [vec2.fromValues(sector.centre[0], sector.centre[1]),
                    vec2.create()]
                };
                for (var i = 0, n = fov.rays.length; i < n; ++i) {
                    vec2.add(r.ends[1], r.ends[0], fov.rays[i]);
                    this.drawLine(r, 0.25, "128, 128, 128");
                }
                // red hit points
                fov.hitPoints.forEach((p, _, set) => {
                    this.drawCircle(p[0], p[1], 3, "255, 0, 0");
                });
                // blue control points
                fov.ctrlPoints.forEach((p, _, set) => {
                    this.drawCircle(p[0], p[1], 3, "0, 0, 255");
                });
            }
        });
    }


    // Shapes
    drawLine = (line, thickness, colour) => {
        var e0 = line.ends[0], e1 = line.ends[1];
        this.ctx.beginPath();
        this.ctx.moveTo(e0[0], e0[1]);
        this.ctx.lineTo(e1[0], e1[1]);
        this.ctx.lineWidth = thickness;
        this.ctx.strokeStyle = "rgb(" + colour + ")";
        this.ctx.stroke();
    }

    drawPolygon = (p) => {
        this.ctx.beginPath();
        this.ctx.moveTo(p.coords[0], p.coords[1]);
        for (var i = 2, n = p.coords.length; i < n; i += 2)
            this.ctx.lineTo(p.coords[i], p.coords[i + 1]);
        this.ctx.closePath();
        if (p.fill) {
            this.ctx.fillStyle = "rgba(" + p.colour + ", 0.15)";
            this.ctx.fill();
        }
        if (p.stroke) {
            this.ctx.lineWidth = p.stroke;
            this.ctx.strokeStyle = "rgb(" + p.colour + ")";
            this.ctx.stroke();
        }
    }

    drawCircle = (x, y, radius, colour) => {
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        // without closePath the circle isn't completed properly
        this.ctx.closePath();
        this.ctx.fillStyle = "rgba(" + colour + ", 0.5)";
        this.ctx.fill();
        this.ctx.strokeStyle = "rgb(" + colour + ")";
        this.ctx.stroke();
    }

    drawPerson = (p) => {
        this.drawCircle(p.loc[0], p.loc[1], Fov.personRadius, p.colour);
    }

    drawFoV = (fig, sector) => {


        this.ctx.beginPath();
        this.ctx.moveTo(sector.centre[0], sector.centre[1]);
        for (var i = 0, len = fig.hitPoints.length; i < len; ++i) {
            var p = fig.hitPoints[i];
            var cp = fig.ctrlPoints[i];
            if (cp)
                this.ctx.quadraticCurveTo(cp[0], cp[1], p[0], p[1]);
            else
                this.ctx.lineTo(p[0], p[1]);
        }
        this.ctx.closePath();
        this.ctx.fillStyle = "rgba(255, 140, 0, 0.35)";
        this.ctx.fill();
    }

    getGraphicFoV = (fig, sector, coneColour, coneAlpha) => {

        if (!sector.centre || !fig) return;

        let graphic = new PIXI.Graphics();
        graphic.clear()
        graphic.beginFill(coneColour ? coneColour : 0xffffff, (coneAlpha !== undefined && coneAlpha !== null) ? coneAlpha : 0.35);

        graphic.moveTo(sector.centre[0], sector.centre[1]);
        for (var i = 0, len = fig.hitPoints.length; i < len; ++i) {
            var p = fig.hitPoints[i];
            var cp = fig.ctrlPoints[i];
            if (cp)
                graphic.quadraticCurveTo(cp[0], cp[1], p[0], p[1]);
            else
                graphic.lineTo(p[0], p[1]);
        }
        graphic.closePath();
        graphic.endFill();
        return graphic;
    }

    getAllFoV = () => {
        return this.scene.observer.map((observer) => (
            this.getGraphicFoV(observer.fov, observer.sector, observer.coneColour, observer.coneAlpha)
        )).filter((v) => v !== undefined)
    }

    toggleDebugView = () => {
        this.debug = !this.debug;
        //window.requestAnimationFrame(this.mainLoop);
    }


    static getPolygonsByCollisionMatrix(collisionMatrix) {
        let mapWidth = collisionMatrix[0].length;
        let mapHeight = collisionMatrix.length;
        let tileSize = 32;
        let cache = [];
        let foundOne = false;
        let polygons = [];

        //search horizontally
        for (let y = 0; y < mapHeight; y++) {
            for (let x = 0; x < mapWidth; x++) {
                //debugger;
                if (collisionMatrix[y][x] === 1) {
                    if (foundOne === false) foundOne = true;
                    cache.push(x);
                } else {
                    //found (map[x][y] == 0) and we have a sequence
                    // [0,0,10,10,20,0,30,30,0,0]
                    if (cache.length > 1 && foundOne === true) {

                        let px1 = cache[0] * tileSize
                        let py1 = y * tileSize

                        let px2 = (cache[cache.length - 1] + 1) * tileSize;
                        let py2 = y * tileSize

                        let px3 = (cache[cache.length - 1] + 1) * tileSize;
                        let py3 = (y + 1) * tileSize

                        let px4 = cache[0] * tileSize
                        let py4 = (y + 1) * tileSize

                        polygons.push([px1, py1, px2, py2, px3, py3, px4, py4]);
                        foundOne = false;
                        cache = [];
                    } else {
                        //ignore single square
                        foundOne = false;
                        cache = [];
                    }
                }
                if (x === mapWidth - 1) {
                    if (cache.length > 1 && foundOne === true) {

                        let px1 = cache[0] * tileSize
                        let py1 = y * tileSize

                        let px2 = cache[cache.length - 1] * tileSize;
                        let py2 = y * tileSize

                        let px3 = cache[cache.length - 1] * tileSize;
                        let py3 = (y + 1) * tileSize

                        let px4 = cache[0] * tileSize
                        let py4 = (y + 1) * tileSize

                        polygons.push([px1, py1, px2, py2, px3, py3, px4, py4]);
                        foundOne = false;
                        cache = [];
                    } else {
                        //ignore single square
                        foundOne = false;
                        cache = [];
                    }
                }
            }
        }
        cache = [];
        //search vertically
        for (let x = 0; x < mapWidth; x++) {
            for (let y = 0; y < mapHeight; y++) {
                //debugger;
                if (collisionMatrix[y][x] === 1) {
                    if (foundOne === false) foundOne = true;
                    cache.push(y);
                } else {
                    //found (map[x][y] == 0) and we have a sequence
                    // [0,0,10,10,20,0,30,30,0,0]
                    if (cache.length > 1 && foundOne === true) {

                        let px1 = x * tileSize
                        let py1 = cache[0] * tileSize

                        let px2 = (x + 1) * tileSize;
                        let py2 = cache[0] * tileSize;

                        let px3 = (x + 1) * tileSize;
                        let py3 = (cache[cache.length - 1] + 1) * tileSize

                        let px4 = x * tileSize;
                        let py4 = (cache[cache.length - 1] + 1) * tileSize;

                        polygons.push([px1, py1, px2, py2, px3, py3, px4, py4]);
                        foundOne = false;
                        cache = [];
                    } else {
                        //ignore single square
                        foundOne = false;
                        cache = [];
                    }
                }
                if (y === mapHeight - 1) {
                    if ((cache.length > 1 && foundOne === true) /*|| (y + 1 === mapHeight)*/) {
                        let px1 = x * tileSize
                        let py1 = cache[0] * tileSize

                        let px2 = (x + 1) * tileSize;
                        let py2 = cache[0] * tileSize;

                        let px3 = (x + 1) * tileSize;
                        let py3 = cache[cache.length - 1] * tileSize

                        let px4 = x * tileSize;
                        let py4 = cache[cache.length - 1] * tileSize;

                        polygons.push([px1, py1, px2, py2, px3, py3, px4, py4]);
                        foundOne = false;
                        cache = [];
                    } else {
                        foundOne = false;
                        cache = [];
                    }
                }
            }
        }

        //search single units
        for (let y = 0; y < mapHeight; y++) {
            for (let x = 0; x < mapWidth; x++) {
                if (y > 0 && x > 0 && y < mapHeight && x < mapWidth) {
                    if (collisionMatrix[y][x] === 1 &&
                        collisionMatrix[y - 1][x] === 0 &&
                        collisionMatrix[y + 1][x] === 0 &&
                        collisionMatrix[y][x - 1] === 0 &&
                        collisionMatrix[y][x + 1] === 0) {
                        //polygons.push([x * tileSize, y * tileSize, tileSize, tileSize]);
                        let px1 = x * tileSize;
                        let py1 = y * tileSize;

                        let px2 = (x + 1) * tileSize;
                        let py2 = y * tileSize;

                        let px3 = (x + 1) * tileSize;
                        let py3 = (y + 1) * tileSize;

                        let px4 = x * tileSize;
                        let py4 = (y + 1) * tileSize;

                        polygons.push([px1, py1, px2, py2, px3, py3, px4, py4]);
                    }
                }
            }
        }
        return polygons;
    }

}

