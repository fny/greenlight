import GL from 'src/common/GL'
import Honeybadger from './honeybadger'
import { dynamicPaths, paths } from 'src/routes'

GL.dynamicPaths = dynamicPaths
GL.paths = paths
GL.Honeybadger = Honeybadger

;(window as any).GL = GL
